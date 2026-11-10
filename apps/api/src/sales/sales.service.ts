import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { format } from 'date-fns';
import {
  InventoryBalance,
  Payment,
  Prisma,
  Product,
  ProductUnit,
  Sale,
  SaleItem,
  StockMovement,
} from '@prisma/client';

type SaleWithDetails = Prisma.SaleGetPayload<{
  include: { saleItems: true; payments: true; location: true };
}>;

import {
  SaleStatus,
  PaymentStatus,
  PaymentMethod,
  SaleSource,
  StockMovementType,
} from '../common/enums';
import {
  add,
  multiply,
  round2,
  subtract,
} from '../common/utils/decimal.util';
import { toPrismaSortOrder } from '../common/utils/prisma-sort.util';
import { dec } from '../common/utils/prisma-decimal.util';

import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleQueryDto } from './dto/sale-query.dto';
import { CancelSaleDto } from './dto/cancel-sale.dto';
import { RefundDto } from './dto/refund.dto';
import { AddPaymentDto } from './dto/add-payment.dto';
import { MembershipsService } from '../memberships/memberships.service';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaTx } from '../common/types/prisma-tx.type';
import {
  applyCustomerSaleCredit,
  resolveCustomerName,
} from '../customers/customer-sale-credit.util';

@Injectable()
export class SalesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly membershipsService: MembershipsService,
    private readonly auditService: AuditService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Generate a human-readable, time-ordered sale number.
   * Format: SAL-YYYYMMDD-NNNN (4-digit sequence per day).
   */
  private async generateSaleNumber(tx: PrismaTx): Promise<string> {
    const today = format(new Date(), 'yyyyMMdd');
    const prefix = `SAL-${today}-`;
    const last = await tx.sale.findFirst({
      where: { saleNumber: { startsWith: prefix } },
      orderBy: { saleNumber: 'desc' },
    });
    let seq = 1;
    if (last) {
      const parts = last.saleNumber.split('-');
      seq = parseInt(parts[parts.length - 1], 10) + 1;
    }
    return `${prefix}${String(seq).padStart(4, '0')}`;
  }

  /**
   * Resolve the selling price for an item.
   * Priority: dto.unitPrice → ProductUnit.sellingPrice → product.sellingPrice * conversionFactor
   */
  private resolveUnitPrice(
    product: Product,
    unit: ProductUnit | null,
    overridePrice?: number,
  ): number {
    if (overridePrice !== undefined && overridePrice !== null) {
      return overridePrice;
    }
    if (unit?.sellingPrice !== null && unit?.sellingPrice !== undefined) {
      return dec(unit.sellingPrice);
    }
    if (unit) {
      return round2(multiply(dec(product.sellingPrice), dec(unit.conversionFactor)));
    }
    return dec(product.sellingPrice);
  }

  /**
   * Determine payment status from amount paid vs total owed.
   */
  private derivePaymentStatus(
    paidAmount: number,
    totalAmount: number,
    method?: PaymentMethod,
  ): PaymentStatus {
    if (!method || method === PaymentMethod.CREDIT) {
      return PaymentStatus.CREDIT;
    }
    if (paidAmount >= totalAmount) {
      return PaymentStatus.PAID;
    }
    if (paidAmount > 0) {
      return PaymentStatus.PARTIAL;
    }
    return PaymentStatus.CREDIT;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // createSale
  // ─────────────────────────────────────────────────────────────────────────────

  async createSale(
    businessId: string,
    userId: string,
    dto: CreateSaleDto,
    source: SaleSource = SaleSource.WEB,
  ): Promise<Sale> {
    await this.membershipsService.assertLocationPermission(
      userId,
      businessId,
      dto.locationId,
      'canSell',
    );

    const createdSale = await this.prisma.$transaction(async (tx) => {
      // ── 1. Process each line item ──────────────────────────────────────────
      const processedItems: Array<{
        product: Product;
        unit: ProductUnit | null;
        quantityInBase: number;
        unitPrice: number;
        discountAmount: number;
        lineTotal: number;
        lineCost: number;
        lineProfit: number;
        unitCostSnapshot: number;
        balance: InventoryBalance;
      }> = [];

      for (const itemDto of dto.items) {
        // Load product and verify ownership
        const product = await tx.product.findFirst({
          where: { id: itemDto.productId, businessId },
        });
        if (!product) {
          throw new NotFoundException(
            `Product ${itemDto.productId} not found or does not belong to this business`,
          );
        }
        if (!product.isActive) {
          throw new BadRequestException(
            `Product "${product.name}" is inactive and cannot be sold`,
          );
        }

        // Resolve unit
        let unit: ProductUnit | null = null;
        let conversionFactor = 1;
        let unitName = product.baseUnit;

        if (itemDto.unitName && itemDto.unitName !== product.baseUnit) {
          unit = await tx.productUnit.findFirst({
            where: { productId: product.id, unitName: itemDto.unitName },
          });
          if (!unit) {
            throw new NotFoundException(
              `Unit "${itemDto.unitName}" not found for product "${product.name}"`,
            );
          }
          conversionFactor = Number(unit.conversionFactor);
          unitName = unit.unitName;
        }

        // Quantity in base units
        const quantityInBase = round2(multiply(itemDto.quantity, conversionFactor));

        // Load inventory balance
        const balance = await tx.inventoryBalance.findFirst({
          where: { productId: product.id, locationId: dto.locationId },
        });
        if (!balance) {
          throw new BadRequestException(
            `No inventory record for "${product.name}" at this location`,
          );
        }
        if (Number(balance.quantity) < quantityInBase) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}". ` +
              `Available: ${balance.quantity} ${product.baseUnit}, ` +
              `Required: ${quantityInBase} ${product.baseUnit}`,
          );
        }

        // Snapshot cost & resolve price
        const unitCostSnapshot = Number(balance.averageCost);
        const unitPrice = this.resolveUnitPrice(product, unit, itemDto.unitPrice);
        const discountAmount = round2(itemDto.discountAmount ?? 0);
        const lineTotal = round2(subtract(multiply(unitPrice, itemDto.quantity), discountAmount));
        const lineCost = round2(multiply(quantityInBase, unitCostSnapshot));
        const lineProfit = round2(subtract(lineTotal, lineCost));

        processedItems.push({
          product,
          unit,
          quantityInBase,
          unitPrice,
          discountAmount,
          lineTotal,
          lineCost,
          lineProfit,
          unitCostSnapshot,
          balance,
        });

        // Assign local variable used below for clarity
        void unitName;
      }

      // ── 2. Compute sale totals ─────────────────────────────────────────────
      const subtotal = round2(
        processedItems.reduce((sum, i) => add(sum, i.lineTotal), 0),
      );
      const saleLevelDiscount = round2(dto.discountAmount ?? 0);
      const totalAmount = round2(subtract(subtotal, saleLevelDiscount));
      const totalCost = round2(processedItems.reduce((sum, i) => add(sum, i.lineCost), 0));
      const grossProfit = round2(subtract(totalAmount, totalCost));

      // ── 3. Generate sale number ────────────────────────────────────────────
      const saleNumber = await this.generateSaleNumber(tx);

      // ── 4. Determine payment status ────────────────────────────────────────
      const paymentAmount = dto.paymentMethod ? totalAmount : 0;
      const paymentStatus = this.derivePaymentStatus(paymentAmount, totalAmount, dto.paymentMethod);
      const customerName =
        dto.customerName ??
        (await resolveCustomerName(tx, businessId, dto.customerId));

      // ── 5. Persist Sale ────────────────────────────────────────────────────
      const savedSale = await tx.sale.create({
        data: {
          saleNumber,
          businessId,
          locationId: dto.locationId,
          userId,
          source,
          status: SaleStatus.COMPLETED,
          subtotal,
          discountAmount: saleLevelDiscount,
          totalAmount,
          totalCost,
          grossProfit,
          paymentStatus,
          customerId: dto.customerId ?? null,
          customerName,
          notes: dto.notes ?? null,
          cancelledAt: null,
          cancelReason: null,
        },
      });

      for (let idx = 0; idx < dto.items.length; idx++) {
        const itemDto = dto.items[idx];
        const processed = processedItems[idx];

        const unitName =
          itemDto.unitName && itemDto.unitName !== processed.product.baseUnit
            ? (processed.unit?.unitName ?? processed.product.baseUnit)
            : processed.product.baseUnit;

        await tx.saleItem.create({
          data: {
            saleId: savedSale.id,
            productId: processed.product.id,
            productName: processed.product.name,
            unitName,
            quantity: itemDto.quantity,
            unitPrice: processed.unitPrice,
            discountAmount: processed.discountAmount,
            lineTotal: processed.lineTotal,
            unitCostSnapshot: processed.unitCostSnapshot,
            lineCost: processed.lineCost,
            lineProfit: processed.lineProfit,
          },
        });

        const newQty = round2(subtract(dec(processed.balance.quantity), processed.quantityInBase));
        const newTotalValue = round2(multiply(newQty, dec(processed.balance.averageCost)));
        await tx.inventoryBalance.update({
          where: { id: processed.balance.id },
          data: {
            quantity: newQty,
            totalValue: newTotalValue,
          },
        });

        await tx.stockMovement.create({
          data: {
            businessId,
            locationId: dto.locationId,
            productId: processed.product.id,
            type: StockMovementType.SALE,
            quantity: -processed.quantityInBase,
            unitCost: processed.unitCostSnapshot,
            totalCost: processed.lineCost,
            referenceType: 'sale',
            referenceId: savedSale.id,
            reason: null,
            userId,
          },
        });
      }

      if (dto.paymentMethod && dto.paymentMethod !== PaymentMethod.CREDIT) {
        await tx.payment.create({
          data: {
            saleId: savedSale.id,
            amount: totalAmount,
            method: dto.paymentMethod,
            reference: dto.paymentReference ?? null,
            paidAt: new Date(),
          },
        });
      }

      if (dto.customerId && paymentStatus === PaymentStatus.CREDIT) {
        await applyCustomerSaleCredit(tx, {
          businessId,
          customerId: dto.customerId,
          saleId: savedSale.id,
          amount: Number(totalAmount),
        });
      }

      return tx.sale.findFirstOrThrow({
        where: { id: savedSale.id },
        include: { saleItems: true, payments: true },
      });
    });

    await this.auditService.log({
      businessId,
      userId,
      action: 'sale.created',
      entityType: 'Sale',
      entityId: createdSale.id,
      newState: {
        saleNumber: createdSale.saleNumber,
        totalAmount: createdSale.totalAmount,
        locationId: createdSale.locationId,
        source,
      },
    });

    return createdSale;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // findAll
  // ─────────────────────────────────────────────────────────────────────────────

  async findAll(
    businessId: string,
    query: SaleQueryDto,
  ): Promise<{ data: Sale[]; total: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { businessId };
    if (query.locationId) where.locationId = query.locationId;
    if (query.customerId) where.customerId = query.customerId;
    if (query.status) where.status = query.status;
    if (query.source) where.source = query.source;
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) {
        where.createdAt.lt = new Date(
          new Date(query.endDate).setDate(new Date(query.endDate).getDate() + 1),
        );
      }
    }

    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = toPrismaSortOrder(query.sortOrder);

    const [data, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        include: { saleItems: true, payments: true },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.sale.count({ where }),
    ]);
    return { data, total };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // findOne
  // ─────────────────────────────────────────────────────────────────────────────

  async findOne(saleId: string, businessId: string): Promise<SaleWithDetails> {
    const sale = await this.prisma.sale.findFirst({
      where: { id: saleId, businessId },
      include: { saleItems: true, payments: true, location: true },
    });
    if (!sale) {
      throw new NotFoundException(`Sale ${saleId} not found`);
    }
    return sale;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // cancelSale
  // ─────────────────────────────────────────────────────────────────────────────

  async cancelSale(
    saleId: string,
    businessId: string,
    userId: string,
    dto: CancelSaleDto,
  ): Promise<Sale> {
    const cancelled = await this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findFirst({
        where: { id: saleId, businessId },
        include: { saleItems: true },
      });
      if (!sale) throw new NotFoundException(`Sale ${saleId} not found`);
      if (sale.status === SaleStatus.CANCELLED) {
        throw new BadRequestException('Sale is already cancelled');
      }
      if (sale.status !== SaleStatus.COMPLETED) {
        throw new BadRequestException(
          `Only completed sales can be cancelled. Current status: ${sale.status}`,
        );
      }

      for (const item of sale.saleItems) {
        const baseQty =
          dec(item.unitCostSnapshot) > 0
            ? round2(dec(item.lineCost) / dec(item.unitCostSnapshot))
            : 0;

        const balance = await tx.inventoryBalance.findFirst({
          where: { productId: item.productId, locationId: sale.locationId },
        });
        if (balance) {
          const restoredQty = round2(add(dec(balance.quantity), baseQty));
          const newTotalValue = round2(multiply(restoredQty, dec(balance.averageCost)));
          await tx.inventoryBalance.update({
            where: { id: balance.id },
            data: {
              quantity: restoredQty,
              totalValue: newTotalValue,
            },
          });
        }

        await tx.stockMovement.create({
          data: {
            businessId,
            locationId: sale.locationId,
            productId: item.productId,
            type: StockMovementType.REVERSAL,
            quantity: baseQty,
            unitCost: dec(item.unitCostSnapshot),
            totalCost: dec(item.lineCost),
            referenceType: 'sale',
            referenceId: saleId,
            reason: dto.reason,
            userId,
          },
        });
      }

      await tx.sale.update({
        where: { id: saleId },
        data: {
          status: SaleStatus.CANCELLED,
          cancelReason: dto.reason,
          cancelledAt: new Date(),
        },
      });

      return tx.sale.findFirstOrThrow({
        where: { id: saleId },
        include: { saleItems: true, payments: true },
      });
    });

    await this.auditService.log({
      businessId,
      userId,
      action: 'sale.cancelled',
      entityType: 'Sale',
      entityId: saleId,
      metadata: { reason: dto.reason },
    });

    return cancelled;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // processRefund
  // ─────────────────────────────────────────────────────────────────────────────

  async processRefund(
    saleId: string,
    businessId: string,
    userId: string,
    dto: RefundDto,
  ): Promise<Sale> {
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findFirst({
        where: { id: saleId, businessId },
        include: { saleItems: true },
      });
      if (!sale) throw new NotFoundException(`Sale ${saleId} not found`);
      if (sale.status === SaleStatus.REFUNDED) {
        throw new BadRequestException('Sale has already been refunded');
      }
      if (sale.status === SaleStatus.CANCELLED) {
        throw new BadRequestException('Cannot refund a cancelled sale');
      }

      if (dto.returnGoods) {
        for (const item of sale.saleItems) {
          const baseQty =
            dec(item.unitCostSnapshot) > 0
              ? round2(dec(item.lineCost) / dec(item.unitCostSnapshot))
              : 0;

          const balance = await tx.inventoryBalance.findFirst({
            where: { productId: item.productId, locationId: sale.locationId },
          });
          if (balance) {
            const restoredQty = round2(add(dec(balance.quantity), baseQty));
            const newTotalValue = round2(multiply(restoredQty, dec(balance.averageCost)));
            await tx.inventoryBalance.update({
              where: { id: balance.id },
              data: {
                quantity: restoredQty,
                totalValue: newTotalValue,
              },
            });
          }

          await tx.stockMovement.create({
            data: {
              businessId,
              locationId: sale.locationId,
              productId: item.productId,
              type: StockMovementType.RETURN,
              quantity: baseQty,
              unitCost: dec(item.unitCostSnapshot),
              totalCost: dec(item.lineCost),
              referenceType: 'sale',
              referenceId: saleId,
              reason: dto.reason,
              userId,
            },
          });
        }
      }

      await tx.sale.update({
        where: { id: saleId },
        data: {
          status: SaleStatus.REFUNDED,
          cancelReason: dto.reason,
          cancelledAt: new Date(),
          paymentStatus: PaymentStatus.CREDIT,
        },
      });

      return tx.sale.findFirstOrThrow({
        where: { id: saleId },
        include: { saleItems: true, payments: true },
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // addPayment
  // ─────────────────────────────────────────────────────────────────────────────

  async addPayment(
    saleId: string,
    businessId: string,
    dto: AddPaymentDto,
  ): Promise<Payment> {
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findFirst({
        where: { id: saleId, businessId },
        include: { payments: true },
      });
      if (!sale) throw new NotFoundException(`Sale ${saleId} not found`);
      if (sale.status !== SaleStatus.COMPLETED) {
        throw new BadRequestException(
          `Cannot add payment to a ${sale.status} sale`,
        );
      }

      const totalPaid = sale.payments.reduce(
        (sum, p) => add(sum, dec(p.amount)),
        0,
      );
      const outstanding = round2(subtract(dec(sale.totalAmount), totalPaid));

      if (outstanding <= 0) {
        throw new BadRequestException('Sale is already fully paid');
      }

      const paymentAmount = Math.min(dto.amount, outstanding);

      const saved = await tx.payment.create({
        data: {
          saleId,
          amount: round2(paymentAmount),
          method: dto.method,
          reference: dto.reference ?? null,
          paidAt: new Date(),
        },
      });

      const newTotalPaid = round2(add(totalPaid, paymentAmount));
      const newStatus =
        newTotalPaid >= dec(sale.totalAmount)
          ? PaymentStatus.PAID
          : PaymentStatus.PARTIAL;

      await tx.sale.update({
        where: { id: saleId },
        data: { paymentStatus: newStatus },
      });

      return saved;
    });
  }
}
