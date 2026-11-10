import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { format } from "date-fns";
import { Stocktake } from "@prisma/client";
import { StocktakeStatus, StockMovementType } from "../common/enums";
import { InventoryService } from "../inventory/inventory.service";
import { MembershipsService } from "../memberships/memberships.service";
import { AuditService } from "../audit/audit.service";
import { round2, subtract } from "../common/utils/decimal.util";
import { dec } from "../common/utils/prisma-decimal.util";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class StocktakesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
    private readonly membershipsService: MembershipsService,
    private readonly auditService: AuditService,
  ) {}

  private async nextNumber(): Promise<string> {
    const today = format(new Date(), "yyyyMMdd");
    const prefix = `STC-${today}-`;
    const last = await this.prisma.stocktake.findFirst({
      where: { stocktakeNumber: { startsWith: prefix } },
      orderBy: { stocktakeNumber: "desc" },
    });
    const seq = last
      ? parseInt(last.stocktakeNumber.split("-").pop()!, 10) + 1
      : 1;
    return `${prefix}${String(seq).padStart(4, "0")}`;
  }

  async create(
    businessId: string,
    userId: string,
    locationId: string,
    notes?: string,
  ) {
    await this.membershipsService.assertLocationPermission(
      userId,
      businessId,
      locationId,
      "canReceiveStock",
    );

    const balances = await this.prisma.inventoryBalance.findMany({
      where: { locationId },
      include: { product: true },
    });

    const stocktakeNumber = await this.nextNumber();
    const stocktake = await this.prisma.stocktake.create({
      data: {
        stocktakeNumber,
        businessId,
        locationId,
        createdByUserId: userId,
        status: StocktakeStatus.COUNTING,
        notes: notes ?? null,
      },
    });

    for (const b of balances) {
      if (!b.product?.isActive) continue;
      await this.prisma.stocktakeLine.create({
        data: {
          stocktakeId: stocktake.id,
          productId: b.productId,
          productName: b.product.name,
          systemQuantity: dec(b.quantity),
          countedQuantity: null,
          varianceQuantity: null,
        },
      });
    }

    return this.findOne(stocktake.id, businessId);
  }

  async findAll(businessId: string, locationId?: string) {
    return this.prisma.stocktake.findMany({
      where: {
        businessId,
        ...(locationId ? { locationId } : {}),
      },
      include: { location: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string, businessId: string) {
    const s = await this.prisma.stocktake.findFirst({
      where: { id, businessId },
      include: { lines: true, location: true },
    });
    if (!s) throw new NotFoundException("Stocktake not found");
    return s;
  }

  async updateCounts(
    id: string,
    businessId: string,
    userId: string,
    lines: Array<{ lineId: string; countedQuantity: number }>,
  ) {
    const stocktake = await this.findOne(id, businessId);
    if (
      ![StocktakeStatus.DRAFT, StocktakeStatus.COUNTING].includes(
        stocktake.status as StocktakeStatus,
      )
    ) {
      throw new BadRequestException("Stocktake is not open for counting");
    }

    for (const upd of lines) {
      const line = stocktake.lines.find((l) => l.id === upd.lineId);
      if (!line) continue;
      const varianceQuantity = round2(
        subtract(upd.countedQuantity, dec(line.systemQuantity)),
      );
      await this.prisma.stocktakeLine.update({
        where: { id: line.id },
        data: {
          countedQuantity: upd.countedQuantity,
          varianceQuantity,
        },
      });
    }

    return this.findOne(id, businessId);
  }

  async submitForApproval(id: string, businessId: string, userId: string) {
    const stocktake = await this.findOne(id, businessId);
    if (stocktake.status !== StocktakeStatus.COUNTING) {
      throw new BadRequestException(
        "Only counting stocktakes can be submitted",
      );
    }
    const incomplete = stocktake.lines.some((l) => l.countedQuantity === null);
    if (incomplete) {
      throw new BadRequestException("All lines must have counted quantities");
    }
    await this.prisma.stocktake.update({
      where: { id },
      data: { status: StocktakeStatus.PENDING_APPROVAL },
    });
    return this.findOne(id, businessId);
  }

  async approve(id: string, businessId: string, userId: string) {
    await this.membershipsService.assertCanApproveStocktake(userId, businessId);
    const stocktake = await this.findOne(id, businessId);
    if (stocktake.status !== StocktakeStatus.PENDING_APPROVAL) {
      throw new BadRequestException("Stocktake is not pending approval");
    }

    for (const line of stocktake.lines) {
      const variance = dec(line.varianceQuantity);
      if (variance === 0) continue;
      await this.inventoryService.adjustStock(
        businessId,
        stocktake.locationId,
        userId,
        {
          productId: line.productId,
          quantity: variance,
          reason: `Stocktake ${stocktake.stocktakeNumber} variance approval`,
          movementType: StockMovementType.ADJUSTMENT,
        },
      );
    }

    await this.prisma.stocktake.update({
      where: { id },
      data: {
        status: StocktakeStatus.APPLIED,
        approvedByUserId: userId,
        appliedAt: new Date(),
      },
    });

    await this.auditService.log({
      businessId,
      userId,
      action: "stocktake.applied",
      entityType: "Stocktake",
      entityId: id,
    });

    return this.findOne(id, businessId);
  }

  async reject(id: string, businessId: string, userId: string) {
    await this.membershipsService.assertCanApproveStocktake(userId, businessId);
    const stocktake = await this.findOne(id, businessId);
    if (stocktake.status !== StocktakeStatus.PENDING_APPROVAL) {
      throw new BadRequestException("Stocktake is not pending approval");
    }
    await this.prisma.stocktake.update({
      where: { id },
      data: { status: StocktakeStatus.COUNTING },
    });
    return this.findOne(id, businessId);
  }
}
