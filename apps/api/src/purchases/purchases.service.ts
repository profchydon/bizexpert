import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { format } from 'date-fns';
import { Purchase, Prisma } from '@prisma/client';

import { PurchaseStatus, StockMovementType } from '../common/enums';
import { add, multiply, round2, subtract, weightedAverageCost } from '../common/utils/decimal.util';
import { dec } from '../common/utils/prisma-decimal.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateGrnNumber(tx: Prisma.TransactionClient): Promise<string> {
    const today = format(new Date(), 'yyyyMMdd');
    const prefix = `GRN-${today}-`;
    const last = await tx.goodsReceipt.findFirst({
      where: { grnNumber: { startsWith: prefix } },
      orderBy: { grnNumber: 'desc' },
    });
    const seq = last ? parseInt(last.grnNumber.split('-').pop()!, 10) + 1 : 1;
    return `${prefix}${String(seq).padStart(4, '0')}`;
  }

  async listGrns(purchaseId: string, businessId: string) {
    await this.findOne(purchaseId, businessId);
    return this.prisma.goodsReceipt.findMany({
      where: { purchaseId, businessId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async generatePurchaseNumber(): Promise<string> {
    const today = format(new Date(), 'yyyyMMdd');
    const prefix = `PO-${today}-`;
    const last = await this.prisma.purchase.findFirst({
      where: { purchaseNumber: { startsWith: prefix } },
      orderBy: { purchaseNumber: 'desc' },
    });
    const seq = last ? parseInt(last.purchaseNumber.split('-').pop()!, 10) + 1 : 1;
    return `${prefix}${String(seq).padStart(4, '0')}`;
  }

  async create(
    businessId: string,
    locationId: string,
    userId: string,
    dto: {
      supplierName?: string;
      supplierId?: string;
      items: Array<{ productId: string; orderedQuantity: number; unitCost: number }>;
      expectedAt?: string;
      notes?: string;
    },
  ): Promise<Purchase> {
    const purchaseNumber = await this.generatePurchaseNumber();
    let totalAmount = 0;

    const purchase = await this.prisma.purchase.create({
      data: {
        purchaseNumber,
        businessId,
        locationId,
        userId,
        supplierName: dto.supplierName ?? null,
        supplierId: dto.supplierId ?? null,
        status: PurchaseStatus.PENDING,
        totalAmount: 0,
        expectedAt: dto.expectedAt ? new Date(dto.expectedAt) : null,
        notes: dto.notes ?? null,
      },
    });

    for (const i of dto.items) {
      const product = await this.prisma.product.findFirst({
        where: { id: i.productId, businessId },
      });
      if (!product) throw new NotFoundException(`Product ${i.productId} not found`);

      const lineTotal = round2(multiply(i.orderedQuantity, i.unitCost));
      totalAmount = round2(add(totalAmount, lineTotal));

      await this.prisma.purchaseItem.create({
        data: {
          purchaseId: purchase.id,
          productId: i.productId,
          productName: product.name,
          orderedQuantity: i.orderedQuantity,
          receivedQuantity: 0,
          unitCost: i.unitCost,
          lineTotal,
        },
      });
    }

    await this.prisma.purchase.update({
      where: { id: purchase.id },
      data: { totalAmount },
    });

    return this.prisma.purchase.findFirstOrThrow({
      where: { id: purchase.id },
      include: { purchaseItems: true },
    });
  }

  async findAll(
    businessId: string,
    query: { page?: number; limit?: number; locationId?: string; status?: PurchaseStatus },
  ): Promise<{ data: Purchase[]; total: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.PurchaseWhereInput = { businessId };
    if (query.locationId) where.locationId = query.locationId;
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.purchase.findMany({
        where,
        include: { purchaseItems: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.purchase.count({ where }),
    ]);
    return { data, total };
  }

  async findOne(purchaseId: string, businessId: string): Promise<Purchase> {
    const p = await this.prisma.purchase.findFirst({
      where: { id: purchaseId, businessId },
      include: { purchaseItems: true },
    });
    if (!p) throw new NotFoundException(`Purchase ${purchaseId} not found`);
    return p;
  }

  async receiveItems(
    purchaseId: string,
    businessId: string,
    userId: string,
    dto: {
      items: Array<{ purchaseItemId: string; receivedQuantity: number; actualUnitCost?: number }>;
      notes?: string;
    },
  ): Promise<Purchase> {
    return this.prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.findFirst({
        where: { id: purchaseId, businessId },
        include: { purchaseItems: true },
      });
      if (!purchase) throw new NotFoundException('Purchase not found');
      if (purchase.status === PurchaseStatus.CANCELLED) {
        throw new BadRequestException('Cannot receive items for a cancelled purchase');
      }

      const grnNumber = await this.generateGrnNumber(tx);
      const grn = await tx.goodsReceipt.create({
        data: {
          grnNumber,
          businessId,
          purchaseId,
          locationId: purchase.locationId,
          userId,
          notes: dto.notes ?? null,
        },
      });

      for (const recv of dto.items) {
        const item = purchase.purchaseItems.find((i) => i.id === recv.purchaseItemId);
        if (!item) throw new NotFoundException(`Purchase item ${recv.purchaseItemId} not found`);

        const unitCost = recv.actualUnitCost ?? dec(item.unitCost);
        const qty = recv.receivedQuantity;
        const variance = round2(
          subtract(qty, subtract(dec(item.orderedQuantity), dec(item.receivedQuantity))),
        );

        await tx.goodsReceiptItem.create({
          data: {
            goodsReceiptId: grn.id,
            purchaseItemId: item.id,
            productName: item.productName,
            orderedQuantity: item.orderedQuantity,
            receivedQuantity: qty,
            varianceQuantity: variance,
            unitCost,
          },
        });

        const newReceived = round2(add(dec(item.receivedQuantity), qty));
        await tx.purchaseItem.update({
          where: { id: item.id },
          data: { receivedQuantity: newReceived, unitCost },
        });

        let balance = await tx.inventoryBalance.findFirst({
          where: { productId: item.productId, locationId: purchase.locationId },
        });
        if (!balance) {
          balance = await tx.inventoryBalance.create({
            data: {
              productId: item.productId,
              locationId: purchase.locationId,
              quantity: 0,
              averageCost: 0,
              totalValue: 0,
            },
          });
        }

        const newAvgCost = weightedAverageCost(
          dec(balance.quantity),
          dec(balance.averageCost),
          qty,
          unitCost,
        );
        const newQty = round2(add(dec(balance.quantity), qty));
        await tx.inventoryBalance.update({
          where: { id: balance.id },
          data: {
            quantity: newQty,
            averageCost: newAvgCost,
            totalValue: round2(multiply(newQty, newAvgCost)),
          },
        });

        await tx.stockMovement.create({
          data: {
            businessId,
            locationId: purchase.locationId,
            productId: item.productId,
            type: StockMovementType.RECEIPT,
            quantity: qty,
            unitCost,
            totalCost: round2(multiply(qty, unitCost)),
            referenceType: 'purchase',
            referenceId: purchaseId,
            reason: dto.notes ?? null,
            userId,
          },
        });
      }

      const refreshed = await tx.purchase.findFirstOrThrow({
        where: { id: purchaseId },
        include: { purchaseItems: true },
      });
      const allReceived = refreshed.purchaseItems.every(
        (i) => dec(i.receivedQuantity) >= dec(i.orderedQuantity),
      );
      const anyReceived = refreshed.purchaseItems.some((i) => dec(i.receivedQuantity) > 0);
      const newStatus = allReceived
        ? PurchaseStatus.RECEIVED
        : anyReceived
          ? PurchaseStatus.PARTIAL
          : PurchaseStatus.PENDING;

      await tx.purchase.update({
        where: { id: purchaseId },
        data: { status: newStatus },
      });

      return tx.purchase.findFirstOrThrow({
        where: { id: purchaseId },
        include: { purchaseItems: true },
      });
    });
  }

  async cancel(purchaseId: string, businessId: string): Promise<Purchase> {
    const p = await this.findOne(purchaseId, businessId);
    if (p.status === PurchaseStatus.RECEIVED) {
      throw new BadRequestException('Cannot cancel a fully received purchase');
    }
    await this.prisma.purchase.update({
      where: { id: purchaseId },
      data: { status: PurchaseStatus.CANCELLED },
    });
    return this.findOne(purchaseId, businessId);
  }
}
