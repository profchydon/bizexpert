import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { format } from "date-fns";
import {
  InventoryBalance,
  Product,
  ProductUnit,
  StockMovement,
  StockTransfer,
} from "@prisma/client";

import { StockMovementType, StockTransferStatus } from "../common/enums";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaTx } from "../common/types/prisma-tx.type";
import { dec } from "../common/utils/prisma-decimal.util";
import {
  add,
  multiply,
  round2,
  subtract,
  weightedAverageCost,
} from "../common/utils/decimal.util";
import { MembershipsService } from "../memberships/memberships.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly membershipsService: MembershipsService,
    private readonly auditService: AuditService,
  ) {}

  private transferInclude = {
    stockTransferItems: true,
    sourceLocation: true,
    destinationLocation: true,
  } as const;

  // ─── Reference number generators ─────────────────────────────────────────────

  private async generateTransferNumber(tx: PrismaTx): Promise<string> {
    const today = format(new Date(), "yyyyMMdd");
    const prefix = `TRF-${today}-`;
    const last = await tx.stockTransfer.findFirst({
      where: { transferNumber: { startsWith: prefix } },
      orderBy: { transferNumber: "desc" },
    });
    const seq = last
      ? parseInt(last.transferNumber.split("-").pop()!, 10) + 1
      : 1;
    return `${prefix}${String(seq).padStart(4, "0")}`;
  }

  // ─── Get or create inventory balance ─────────────────────────────────────────

  async getOrCreateBalance(
    tx: PrismaTx,
    productId: string,
    locationId: string,
  ): Promise<InventoryBalance> {
    let balance = await tx.inventoryBalance.findFirst({
      where: { productId, locationId },
    });
    if (!balance) {
      balance = await tx.inventoryBalance.create({
        data: {
          productId,
          locationId,
          quantity: 0,
          averageCost: 0,
          totalValue: 0,
        },
      });
    }
    return balance;
  }

  // ─── setOpeningStock ─────────────────────────────────────────────────────────

  async setOpeningStock(
    businessId: string,
    locationId: string,
    userId: string,
    dto: { productId: string; quantity: number; unitCost: number },
  ): Promise<InventoryBalance> {
    await this.membershipsService.assertLocationPermission(
      userId,
      businessId,
      locationId,
      "canReceiveStock",
    );
    const balance = await this.prisma.$transaction(async (tx) => {
      const balance = await this.getOrCreateBalance(
        tx,
        dto.productId,
        locationId,
      );

      const newAvgCost = weightedAverageCost(
        Number(balance.quantity),
        Number(balance.averageCost),
        dto.quantity,
        dto.unitCost,
      );
      const newQty = round2(add(Number(balance.quantity), dto.quantity));
      const newTotalValue = round2(multiply(newQty, newAvgCost));

      await tx.inventoryBalance.update({
        where: { id: balance.id },
        data: {
          quantity: newQty,
          averageCost: newAvgCost,
          totalValue: newTotalValue,
        },
      });

      await tx.stockMovement.create({
        data: {
          businessId,
          locationId,
          productId: dto.productId,
          type: StockMovementType.OPENING,
          quantity: dto.quantity,
          unitCost: dto.unitCost,
          totalCost: round2(multiply(dto.quantity, dto.unitCost)),
          referenceType: "opening",
          referenceId: null,
          reason: "Opening stock",
          userId,
        },
      });

      return tx.inventoryBalance.findFirstOrThrow({
        where: { id: balance.id },
      });
    });
    await this.auditService.log({
      businessId,
      userId,
      action: "stock.opening",
      entityType: "InventoryBalance",
      entityId: balance.id,
      newState: {
        productId: dto.productId,
        locationId,
        quantity: dto.quantity,
      },
    });
    return balance;
  }

  // ─── receiveStock ─────────────────────────────────────────────────────────────

  async receiveStock(
    businessId: string,
    locationId: string,
    userId: string,
    dto: {
      productId: string;
      quantity: number;
      unitCost: number;
      notes?: string;
    },
  ): Promise<{ balance: InventoryBalance; movement: StockMovement }> {
    await this.membershipsService.assertLocationPermission(
      userId,
      businessId,
      locationId,
      "canReceiveStock",
    );
    const result = await this.prisma.$transaction(async (tx) => {
      const balance = await this.getOrCreateBalance(
        tx,
        dto.productId,
        locationId,
      );

      const newAvgCost = weightedAverageCost(
        Number(balance.quantity),
        Number(balance.averageCost),
        dto.quantity,
        dto.unitCost,
      );
      const newQty = round2(add(Number(balance.quantity), dto.quantity));
      const newTotalValue = round2(multiply(newQty, newAvgCost));

      await tx.inventoryBalance.update({
        where: { id: balance.id },
        data: {
          quantity: newQty,
          averageCost: newAvgCost,
          totalValue: newTotalValue,
        },
      });

      const movement = await tx.stockMovement.create({
        data: {
          businessId,
          locationId,
          productId: dto.productId,
          type: StockMovementType.RECEIPT,
          quantity: dto.quantity,
          unitCost: dto.unitCost,
          totalCost: round2(multiply(dto.quantity, dto.unitCost)),
          referenceType: "receipt",
          referenceId: null,
          reason: dto.notes ?? null,
          userId,
        },
      });

      const updatedBalance = await tx.inventoryBalance.findFirstOrThrow({
        where: { id: balance.id },
      });
      return { balance: updatedBalance, movement };
    });
    await this.auditService.log({
      businessId,
      userId,
      action: "stock.received",
      entityType: "StockMovement",
      entityId: result.movement.id,
      newState: {
        productId: dto.productId,
        quantity: dto.quantity,
        locationId,
      },
    });
    return result;
  }

  // ─── adjustStock ─────────────────────────────────────────────────────────────

  async adjustStock(
    businessId: string,
    locationId: string,
    userId: string,
    dto: {
      productId: string;
      quantity: number; // can be negative
      reason: string;
      movementType?: StockMovementType;
    },
  ): Promise<{ balance: InventoryBalance; movement: StockMovement }> {
    await this.membershipsService.assertLocationPermission(
      userId,
      businessId,
      locationId,
      "canReceiveStock",
    );
    const result = await this.prisma.$transaction(async (tx) => {
      const balance = await this.getOrCreateBalance(
        tx,
        dto.productId,
        locationId,
      );

      if (dto.quantity < 0 && Number(balance.quantity) + dto.quantity < 0) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${balance.quantity}, Adjustment: ${dto.quantity}`,
        );
      }

      const newQty = round2(add(Number(balance.quantity), dto.quantity));
      const newTotalValue = round2(
        multiply(newQty, Number(balance.averageCost)),
      );

      await tx.inventoryBalance.update({
        where: { id: balance.id },
        data: {
          quantity: newQty,
          totalValue: newTotalValue,
        },
      });

      const movement = await tx.stockMovement.create({
        data: {
          businessId,
          locationId,
          productId: dto.productId,
          type: dto.movementType ?? StockMovementType.ADJUSTMENT,
          quantity: dto.quantity,
          unitCost: Number(balance.averageCost),
          totalCost: round2(
            multiply(Math.abs(dto.quantity), Number(balance.averageCost)),
          ),
          referenceType: "adjustment",
          referenceId: null,
          reason: dto.reason,
          userId,
        },
      });

      const updatedBalance = await tx.inventoryBalance.findFirstOrThrow({
        where: { id: balance.id },
      });
      return { balance: updatedBalance, movement };
    });
    await this.auditService.log({
      businessId,
      userId,
      action: "stock.adjusted",
      entityType: "StockMovement",
      entityId: result.movement.id,
      newState: {
        productId: dto.productId,
        quantity: dto.quantity,
        reason: dto.reason,
      },
    });
    return result;
  }

  // ─── transferStock ────────────────────────────────────────────────────────────

  async transferStock(
    businessId: string,
    userId: string,
    dto: {
      sourceLocationId: string;
      destinationLocationId: string;
      items: Array<{ productId: string; quantity: number }>;
      notes?: string;
      immediate?: boolean;
    },
  ): Promise<StockTransfer> {
    if (dto.immediate) {
      return this.completeTransferImmediately(businessId, userId, dto);
    }
    return this.dispatchTransfer(businessId, userId, dto);
  }

  async listTransfers(businessId: string, status?: string) {
    return this.prisma.stockTransfer.findMany({
      where: {
        businessId,
        ...(status ? { status: status as StockTransferStatus } : {}),
      },
      include: this.transferInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  private async dispatchTransfer(
    businessId: string,
    userId: string,
    dto: {
      sourceLocationId: string;
      destinationLocationId: string;
      items: Array<{ productId: string; quantity: number }>;
      notes?: string;
    },
  ): Promise<StockTransfer> {
    if (dto.sourceLocationId === dto.destinationLocationId) {
      throw new BadRequestException(
        "Source and destination locations must be different",
      );
    }

    await this.membershipsService.assertLocationPermission(
      userId,
      businessId,
      dto.sourceLocationId,
      "canTransferStock",
    );

    const completedTransfer = await this.prisma.$transaction(async (tx) => {
      const transferNumber = await this.generateTransferNumber(tx);

      const transferRecord = await tx.stockTransfer.create({
        data: {
          transferNumber,
          businessId,
          sourceLocationId: dto.sourceLocationId,
          destinationLocationId: dto.destinationLocationId,
          userId,
          status: StockTransferStatus.IN_TRANSIT,
          notes: dto.notes ?? null,
        },
      });

      for (const item of dto.items) {
        // Validate source balance
        const srcBalance = await tx.inventoryBalance.findFirst({
          where: {
            productId: item.productId,
            locationId: dto.sourceLocationId,
          },
        });
        if (!srcBalance || Number(srcBalance.quantity) < item.quantity) {
          const product = await tx.product.findFirst({
            where: { id: item.productId },
          });
          throw new BadRequestException(
            `Insufficient stock for "${product?.name ?? item.productId}". ` +
              `Available: ${srcBalance?.quantity ?? 0}, Requested: ${item.quantity}`,
          );
        }

        const unitCost = Number(srcBalance.averageCost);

        // Deduct from source
        const srcNewQty = round2(
          subtract(Number(srcBalance.quantity), item.quantity),
        );
        await tx.inventoryBalance.update({
          where: { id: srcBalance.id },
          data: {
            quantity: srcNewQty,
            totalValue: round2(multiply(srcNewQty, unitCost)),
          },
        });

        await tx.stockMovement.create({
          data: {
            businessId,
            locationId: dto.sourceLocationId,
            productId: item.productId,
            type: StockMovementType.TRANSFER_OUT,
            quantity: -item.quantity,
            unitCost,
            totalCost: round2(multiply(item.quantity, unitCost)),
            referenceType: "transfer",
            referenceId: transferRecord.id,
            reason: dto.notes ?? null,
            userId,
          },
        });

        await tx.stockTransferItem.create({
          data: {
            transferId: transferRecord.id,
            productId: item.productId,
            productName:
              (await tx.product.findFirst({ where: { id: item.productId } }))
                ?.name ?? "",
            quantity: item.quantity,
            receivedQuantity: 0,
            unitCost,
          },
        });
      }

      return tx.stockTransfer.findFirstOrThrow({
        where: { id: transferRecord.id },
        include: this.transferInclude,
      });
    });

    await this.auditService.log({
      businessId,
      userId,
      action: "stock.transfer.dispatched",
      entityType: "StockTransfer",
      entityId: completedTransfer.id,
      newState: {
        transferNumber: completedTransfer.transferNumber,
        status: StockTransferStatus.IN_TRANSIT,
      },
    });

    return completedTransfer;
  }

  private async completeTransferImmediately(
    businessId: string,
    userId: string,
    dto: {
      sourceLocationId: string;
      destinationLocationId: string;
      items: Array<{ productId: string; quantity: number }>;
      notes?: string;
    },
  ): Promise<StockTransfer> {
    const transfer = await this.dispatchTransfer(businessId, userId, dto);
    return this.receiveTransfer(businessId, userId, transfer.id, {
      items: dto.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    });
  }

  async receiveTransfer(
    businessId: string,
    userId: string,
    transferId: string,
    dto: { items?: Array<{ productId: string; quantity: number }> },
  ): Promise<StockTransfer> {
    const transfer = await this.prisma.stockTransfer.findFirst({
      where: { id: transferId, businessId },
      include: { stockTransferItems: true },
    });
    if (!transfer) throw new NotFoundException("Transfer not found");
    if (transfer.status !== StockTransferStatus.IN_TRANSIT) {
      throw new BadRequestException("Transfer is not in transit");
    }

    await this.membershipsService.assertLocationPermission(
      userId,
      businessId,
      transfer.destinationLocationId,
      "canReceiveStock",
    );

    const received = await this.prisma.$transaction(async (tx) => {
      for (const line of transfer.stockTransferItems) {
        const requested = dto.items?.find(
          (i) => i.productId === line.productId,
        );
        const qtyToReceive = requested
          ? requested.quantity
          : round2(
              subtract(Number(line.quantity), Number(line.receivedQuantity)),
            );
        if (qtyToReceive <= 0) continue;

        const outstanding = round2(
          subtract(Number(line.quantity), Number(line.receivedQuantity)),
        );
        if (qtyToReceive > outstanding) {
          throw new BadRequestException(
            `Cannot receive ${qtyToReceive} for ${line.productName}; outstanding ${outstanding}`,
          );
        }

        const unitCost = Number(line.unitCost);
        const dstBalance = await this.getOrCreateBalance(
          tx,
          line.productId,
          transfer.destinationLocationId,
        );
        const newAvgCost = weightedAverageCost(
          Number(dstBalance.quantity),
          Number(dstBalance.averageCost),
          qtyToReceive,
          unitCost,
        );
        const dstNewQty = round2(
          add(Number(dstBalance.quantity), qtyToReceive),
        );
        await tx.inventoryBalance.update({
          where: { id: dstBalance.id },
          data: {
            quantity: dstNewQty,
            averageCost: newAvgCost,
            totalValue: round2(multiply(dstNewQty, newAvgCost)),
          },
        });

        await tx.stockMovement.create({
          data: {
            businessId,
            locationId: transfer.destinationLocationId,
            productId: line.productId,
            type: StockMovementType.TRANSFER_IN,
            quantity: qtyToReceive,
            unitCost,
            totalCost: round2(multiply(qtyToReceive, unitCost)),
            referenceType: "transfer",
            referenceId: transfer.id,
            reason: transfer.notes,
            userId,
          },
        });

        const newReceivedQty = round2(
          add(Number(line.receivedQuantity), qtyToReceive),
        );
        await tx.stockTransferItem.update({
          where: { id: line.id },
          data: { receivedQuantity: newReceivedQty },
        });
      }

      const refreshed = await tx.stockTransfer.findFirstOrThrow({
        where: { id: transferId },
        include: { stockTransferItems: true },
      });
      const allReceived = refreshed.stockTransferItems.every(
        (i) => Number(i.receivedQuantity) >= Number(i.quantity),
      );
      if (allReceived) {
        await tx.stockTransfer.update({
          where: { id: transferId },
          data: { status: StockTransferStatus.COMPLETED },
        });
      }
      return tx.stockTransfer.findFirstOrThrow({
        where: { id: transferId },
        include: this.transferInclude,
      });
    });

    await this.auditService.log({
      businessId,
      userId,
      action: "stock.transfer.received",
      entityType: "StockTransfer",
      entityId: transferId,
    });

    return received;
  }

  async cancelInTransitTransfer(
    businessId: string,
    userId: string,
    transferId: string,
  ): Promise<StockTransfer> {
    const transfer = await this.prisma.stockTransfer.findFirst({
      where: { id: transferId, businessId },
      include: { stockTransferItems: true },
    });
    if (!transfer) throw new NotFoundException("Transfer not found");
    if (transfer.status !== StockTransferStatus.IN_TRANSIT) {
      throw new BadRequestException(
        "Only in-transit transfers can be cancelled",
      );
    }

    const cancelled = await this.prisma.$transaction(async (tx) => {
      for (const line of transfer.stockTransferItems) {
        const restoreQty = round2(
          subtract(Number(line.quantity), Number(line.receivedQuantity)),
        );
        if (restoreQty <= 0) continue;

        const balance = await tx.inventoryBalance.findFirst({
          where: {
            productId: line.productId,
            locationId: transfer.sourceLocationId,
          },
        });
        if (!balance) continue;
        const unitCost = Number(line.unitCost);
        const newQty = round2(add(Number(balance.quantity), restoreQty));
        await tx.inventoryBalance.update({
          where: { id: balance.id },
          data: {
            quantity: newQty,
            totalValue: round2(multiply(newQty, unitCost)),
          },
        });
        await tx.stockMovement.create({
          data: {
            businessId,
            locationId: transfer.sourceLocationId,
            productId: line.productId,
            type: StockMovementType.REVERSAL,
            quantity: restoreQty,
            unitCost,
            totalCost: round2(multiply(restoreQty, unitCost)),
            referenceType: "transfer_cancel",
            referenceId: transfer.id,
            reason: "Transfer cancelled — stock restored",
            userId,
          },
        });
      }
      await tx.stockTransfer.update({
        where: { id: transferId },
        data: { status: StockTransferStatus.CANCELLED },
      });
      return tx.stockTransfer.findFirstOrThrow({
        where: { id: transferId },
        include: this.transferInclude,
      });
    });

    await this.auditService.log({
      businessId,
      userId,
      action: "stock.transfer.cancelled",
      entityType: "StockTransfer",
      entityId: transferId,
    });

    return cancelled;
  }

  // ─── Queries ─────────────────────────────────────────────────────────────────

  async getBalance(
    productId: string,
    locationId: string,
  ): Promise<InventoryBalance | null> {
    return this.prisma.inventoryBalance.findFirst({
      where: { productId, locationId },
    });
  }

  async getLocationBalances(
    businessId: string,
    locationId?: string,
  ): Promise<
    (InventoryBalance & {
      product: Product;
      location: { businessId: string };
    })[]
  > {
    return this.prisma.inventoryBalance.findMany({
      where: {
        location: { businessId },
        ...(locationId ? { locationId } : {}),
      },
      include: { product: true, location: true },
      orderBy: { product: { name: "asc" } },
    });
  }

  async getMovementHistory(
    businessId: string,
    query: {
      locationId?: string;
      productId?: string;
      type?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{
    data: (StockMovement & { product: Product })[];
    total: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      businessId,
      ...(query.locationId ? { locationId: query.locationId } : {}),
      ...(query.productId ? { productId: query.productId } : {}),
      ...(query.type ? { type: query.type as StockMovementType } : {}),
      ...(query.startDate || query.endDate
        ? {
            createdAt: {
              ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
              ...(query.endDate ? { lt: new Date(query.endDate) } : {}),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where,
        include: { product: true, location: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.stockMovement.count({ where }),
    ]);
    return { data, total };
  }

  async getLowStockProducts(
    businessId: string,
    locationId?: string,
  ): Promise<InventoryBalance[]> {
    const balances = await this.prisma.inventoryBalance.findMany({
      where: {
        location: { businessId },
        product: { isActive: true },
        ...(locationId ? { locationId } : {}),
      },
      include: { product: true, location: true },
      orderBy: { quantity: "asc" },
    });

    return balances.filter(
      (ib) =>
        dec(ib.quantity) <=
        dec(ib.lowStockThreshold ?? ib.product.lowStockThreshold),
    );
  }

  // ─── Internal: deductStock (called by sales & pending-actions) ───────────────

  async deductStock(
    tx: PrismaTx,
    productId: string,
    locationId: string,
    userId: string,
    businessId: string,
    quantity: number,
    unitCost: number,
    referenceType: string,
    referenceId: string,
  ): Promise<StockMovement> {
    const balance = await tx.inventoryBalance.findFirst({
      where: { productId, locationId },
    });
    if (!balance || Number(balance.quantity) < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${balance?.quantity ?? 0}, Required: ${quantity}`,
      );
    }

    const newQty = round2(subtract(Number(balance.quantity), quantity));
    await tx.inventoryBalance.update({
      where: { id: balance.id },
      data: {
        quantity: newQty,
        totalValue: round2(multiply(newQty, Number(balance.averageCost))),
      },
    });

    return tx.stockMovement.create({
      data: {
        businessId,
        locationId,
        productId,
        type: StockMovementType.SALE,
        quantity: -quantity,
        unitCost,
        totalCost: round2(multiply(quantity, unitCost)),
        referenceType,
        referenceId,
        reason: null,
        userId,
      },
    });
  }
}
