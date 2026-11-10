import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { addMinutes } from 'date-fns';
import {
  Business,
  Location,
  Product,
  ProductUnit,
  User,
  WhatsappIdentity,
} from '@prisma/client';

import {
  PendingActionType,
  PendingActionStatus,
  SaleSource,
} from '../common/enums';
import { SalesService } from '../sales/sales.service';
import { InventoryService } from '../inventory/inventory.service';
import {
  add,
  multiply,
  round2,
  weightedAverageCost,
} from '../common/utils/decimal.util';
import { dec } from '../common/utils/prisma-decimal.util';
import { PrismaService } from '../prisma/prisma.service';

interface ActionContext {
  user: User;
  business: Business;
  identity: WhatsappIdentity;
}

type ProductWithUnits = Product & { productUnits: ProductUnit[] };

@Injectable()
export class PendingActionsService {
  private readonly logger = new Logger(PendingActionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly salesService: SalesService,
    private readonly inventoryService: InventoryService,
  ) {}

  async resolveProductByName(businessId: string, name: string): Promise<ProductWithUnits | null> {
    return this.prisma.product.findFirst({
      where: {
        businessId,
        isActive: true,
        name: { contains: name, mode: 'insensitive' },
      },
      include: { productUnits: true },
      orderBy: { name: 'asc' },
    });
  }

  async resolveLocationByName(businessId: string, name: string): Promise<Location | null> {
    return this.prisma.location.findFirst({
      where: {
        businessId,
        isActive: true,
        name: { contains: name, mode: 'insensitive' },
      },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
  }

  async getDefaultLocation(businessId: string, identity: WhatsappIdentity): Promise<Location | null> {
    if (identity.defaultLocationId) {
      return this.prisma.location.findUnique({ where: { id: identity.defaultLocationId } });
    }
    return this.prisma.location.findFirst({ where: { businessId, isDefault: true } });
  }

  private checksum(data: object): string {
    return createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  async previewSale(
    ctx: ActionContext,
    args: {
      location_name?: string;
      items: Array<{ product_name: string; quantity: number; unit_name?: string; unit_price?: number }>;
      customer_name?: string;
    },
  ): Promise<string> {
    const businessId = ctx.business.id;

    let location: Location | null;
    if (args.location_name) {
      location = await this.resolveLocationByName(businessId, args.location_name);
    } else {
      location = await this.getDefaultLocation(businessId, ctx.identity);
    }

    if (!location) {
      return '⚠️ Could not find that location. Please specify a valid shop or warehouse name.';
    }

    const lines: string[] = [];
    let totalAmount = 0;
    let totalCost = 0;
    const saleItems: any[] = [];

    for (const arg of args.items) {
      const product = await this.resolveProductByName(businessId, arg.product_name);
      if (!product) {
        return `⚠️ Product "${arg.product_name}" not found. Please check the name and try again.`;
      }

      let unit: ProductUnit | null = null;
      let conversionFactor = 1;
      let unitName = product.baseUnit;

      if (arg.unit_name && arg.unit_name !== product.baseUnit) {
        unit = product.productUnits?.find(
          (u) => u.unitName.toLowerCase() === arg.unit_name!.toLowerCase(),
        ) ?? null;
        if (!unit) {
          return `⚠️ Unit "${arg.unit_name}" not found for "${product.name}". Available units: ${product.productUnits?.map((u) => u.unitName).join(', ') || product.baseUnit}`;
        }
        conversionFactor = dec(unit.conversionFactor);
        unitName = unit.unitName;
      }

      const qtyInBase = round2(multiply(arg.quantity, conversionFactor));
      const balance = await this.prisma.inventoryBalance.findFirst({
        where: { productId: product.id, locationId: location.id },
      });

      const available = dec(balance?.quantity);
      if (available < qtyInBase) {
        return `⚠️ Insufficient stock for "${product.name}" at ${location.name}. Available: ${available} ${product.baseUnit}, Required: ${qtyInBase} ${product.baseUnit}`;
      }

      const unitPrice = arg.unit_price ?? (unit?.sellingPrice ? dec(unit.sellingPrice) : round2(multiply(dec(product.sellingPrice), conversionFactor)));
      const lineTotal = round2(multiply(unitPrice, arg.quantity));
      const lineCost = round2(multiply(qtyInBase, dec(balance?.averageCost)));

      totalAmount = round2(add(totalAmount, lineTotal));
      totalCost = round2(add(totalCost, lineCost));

      lines.push(`  • ${arg.quantity} ${unitName} of *${product.name}* @ ₦${unitPrice.toLocaleString()} = ₦${lineTotal.toLocaleString()}`);
      saleItems.push({
        productId: product.id,
        quantity: arg.quantity,
        unitName,
        unitPrice,
        discountAmount: 0,
      });
    }

    const grossProfit = round2(totalAmount - totalCost);
    const payload = {
      actionType: PendingActionType.SALE,
      locationId: location.id,
      items: saleItems,
      customerName: args.customer_name ?? null,
      totalAmount,
      totalCost,
      grossProfit,
    };

    const action = await this.prisma.pendingAction.create({
      data: {
        businessId,
        userId: ctx.user.id,
        whatsappPhone: ctx.identity.whatsappPhone,
        actionType: PendingActionType.SALE,
        payload,
        checksum: this.checksum(payload),
        status: PendingActionStatus.PENDING,
        expiresAt: addMinutes(new Date(), 10),
      },
    });

    return (
      `📋 *Sale Preview* — ${location.name}\n\n` +
      lines.join('\n') +
      `\n\n💰 *Total: ₦${totalAmount.toLocaleString()}*` +
      `\n📊 Gross Profit: ₦${grossProfit.toLocaleString()}` +
      (args.customer_name ? `\n👤 Customer: ${args.customer_name}` : '') +
      `\n\n✅ Reply *CONFIRM ${action.id.slice(0, 8)}* to record this sale, or *CANCEL* to abort.` +
      `\n⏰ This preview expires in 10 minutes.`
    );
  }

  async previewStockReceipt(
    ctx: ActionContext,
    args: {
      location_name?: string;
      product_name: string;
      quantity: number;
      unit_name?: string;
      unit_cost: number;
    },
  ): Promise<string> {
    const businessId = ctx.business.id;

    let location: Location | null;
    if (args.location_name) {
      location = await this.resolveLocationByName(businessId, args.location_name);
    } else {
      location = await this.getDefaultLocation(businessId, ctx.identity);
    }
    if (!location) return '⚠️ Location not found.';

    const product = await this.resolveProductByName(businessId, args.product_name);
    if (!product) return `⚠️ Product "${args.product_name}" not found.`;

    let conversionFactor = 1;
    let unitName = product.baseUnit;
    if (args.unit_name && args.unit_name !== product.baseUnit) {
      const unit = product.productUnits?.find(
        (u) => u.unitName.toLowerCase() === args.unit_name!.toLowerCase(),
      );
      if (!unit) return `⚠️ Unit "${args.unit_name}" not found for "${product.name}".`;
      conversionFactor = dec(unit.conversionFactor);
      unitName = unit.unitName;
    }

    const qtyInBase = round2(multiply(args.quantity, conversionFactor));
    const balance = await this.prisma.inventoryBalance.findFirst({
      where: { productId: product.id, locationId: location.id },
    });

    const existingQty = dec(balance?.quantity);
    const existingAvgCost = dec(balance?.averageCost);
    const newAvgCost = weightedAverageCost(existingQty, existingAvgCost, qtyInBase, args.unit_cost);
    const newQty = round2(add(existingQty, qtyInBase));
    const receiptCost = round2(multiply(qtyInBase, args.unit_cost));

    const payload = {
      actionType: PendingActionType.STOCK_RECEIPT,
      locationId: location.id,
      productId: product.id,
      quantity: qtyInBase,
      unitCost: args.unit_cost,
    };

    const action = await this.prisma.pendingAction.create({
      data: {
        businessId,
        userId: ctx.user.id,
        whatsappPhone: ctx.identity.whatsappPhone,
        actionType: PendingActionType.STOCK_RECEIPT,
        payload,
        checksum: this.checksum(payload),
        status: PendingActionStatus.PENDING,
        expiresAt: addMinutes(new Date(), 10),
      },
    });

    return (
      `📦 *Stock Receipt Preview*\n\n` +
      `Product: *${product.name}*\n` +
      `Location: *${location.name}*\n` +
      `Quantity: ${args.quantity} ${unitName} (${qtyInBase} ${product.baseUnit})\n` +
      `Unit Cost: ₦${args.unit_cost.toLocaleString()}\n` +
      `Total Cost: ₦${receiptCost.toLocaleString()}\n\n` +
      `📊 *Cost Impact*\n` +
      `  Before: ${existingQty} ${product.baseUnit} @ ₦${existingAvgCost.toFixed(2)} avg\n` +
      `  After: ${newQty} ${product.baseUnit} @ ₦${newAvgCost.toFixed(2)} avg (weighted)\n\n` +
      `✅ Reply *CONFIRM ${action.id.slice(0, 8)}* to receive this stock.\n⏰ Expires in 10 minutes.`
    );
  }

  async previewStockTransfer(
    ctx: ActionContext,
    args: {
      source_location: string;
      destination_location: string;
      items: Array<{ product_name: string; quantity: number }>;
    },
  ): Promise<string> {
    const businessId = ctx.business.id;

    const source = await this.resolveLocationByName(businessId, args.source_location);
    if (!source) return `⚠️ Source location "${args.source_location}" not found.`;

    const dest = await this.resolveLocationByName(businessId, args.destination_location);
    if (!dest) return `⚠️ Destination location "${args.destination_location}" not found.`;

    if (source.id === dest.id) return '⚠️ Source and destination must be different locations.';

    const lines: string[] = [];
    const transferItems: any[] = [];

    for (const arg of args.items) {
      const product = await this.resolveProductByName(businessId, arg.product_name);
      if (!product) return `⚠️ Product "${arg.product_name}" not found.`;

      const balance = await this.prisma.inventoryBalance.findFirst({
        where: { productId: product.id, locationId: source.id },
      });
      const available = dec(balance?.quantity);
      if (available < arg.quantity) {
        return `⚠️ Insufficient stock for "${product.name}" at ${source.name}. Available: ${available}, Requested: ${arg.quantity}`;
      }

      lines.push(`  • ${arg.quantity} ${product.baseUnit} of *${product.name}*`);
      transferItems.push({ productId: product.id, quantity: arg.quantity });
    }

    const payload = {
      actionType: PendingActionType.STOCK_TRANSFER,
      sourceLocationId: source.id,
      destinationLocationId: dest.id,
      items: transferItems,
    };

    const action = await this.prisma.pendingAction.create({
      data: {
        businessId,
        userId: ctx.user.id,
        whatsappPhone: ctx.identity.whatsappPhone,
        actionType: PendingActionType.STOCK_TRANSFER,
        payload,
        checksum: this.checksum(payload),
        status: PendingActionStatus.PENDING,
        expiresAt: addMinutes(new Date(), 10),
      },
    });

    return (
      `🔄 *Stock Transfer Preview*\n\n` +
      `From: *${source.name}*\nTo: *${dest.name}*\n\n` +
      `Items:\n${lines.join('\n')}\n\n` +
      `✅ Reply *CONFIRM ${action.id.slice(0, 8)}* to execute transfer.\n⏰ Expires in 10 minutes.`
    );
  }

  async confirmAction(ctx: ActionContext, actionIdPrefix: string): Promise<string> {
    return this.prisma.$transaction(async (tx) => {
      const actions = await tx.$queryRaw<
        { id: string; payload: unknown; checksum: string; actionType: string; expiresAt: Date }[]
      >`
        SELECT id, payload, checksum, "actionType", "expiresAt"
        FROM pending_actions
        WHERE "businessId" = ${ctx.business.id}::uuid
          AND "userId" = ${ctx.user.id}::uuid
          AND status = 'pending'
          AND id::text LIKE ${`${actionIdPrefix}%`}
        FOR UPDATE
      `;

      if (actions.length === 0) {
        return '⚠️ No pending action found with that ID. It may have already been confirmed, expired, or cancelled.';
      }
      if (actions.length > 1) {
        return '⚠️ Ambiguous action ID. Please provide more characters.';
      }

      const action = actions[0];

      if (new Date() > action.expiresAt) {
        await tx.pendingAction.update({
          where: { id: action.id },
          data: { status: PendingActionStatus.EXPIRED },
        });
        return '⏰ This action has expired. Please create a new request.';
      }

      const currentChecksum = this.checksum(action.payload as object);
      if (currentChecksum !== action.checksum) {
        await tx.pendingAction.update({
          where: { id: action.id },
          data: { status: PendingActionStatus.CANCELLED },
        });
        return '⚠️ Transaction conditions have changed. Please start a new request.';
      }

      await tx.pendingAction.update({
        where: { id: action.id },
        data: {
          status: PendingActionStatus.CONFIRMED,
          confirmedAt: new Date(),
        },
      });

      const payload = action.payload as any;

      try {
        if (action.actionType === PendingActionType.SALE) {
          const sale = await this.salesService.createSale(
            ctx.business.id,
            ctx.user.id,
            {
              locationId: payload.locationId,
              items: payload.items,
              customerName: payload.customerName,
              paymentMethod: undefined,
            },
            SaleSource.WHATSAPP,
          );
          return (
            `✅ *Sale Recorded Successfully!*\n\n` +
            `Sale #: ${sale.saleNumber}\n` +
            `Total: ₦${dec(sale.totalAmount).toLocaleString()}\n` +
            `Profit: ₦${dec(sale.grossProfit).toLocaleString()}\n` +
            `Status: ${sale.paymentStatus.toUpperCase()}`
          );
        }

        if (action.actionType === PendingActionType.STOCK_RECEIPT) {
          const result = await this.inventoryService.receiveStock(
            ctx.business.id,
            payload.locationId,
            ctx.user.id,
            {
              productId: payload.productId,
              quantity: payload.quantity,
              unitCost: payload.unitCost,
            },
          );
          return (
            `✅ *Stock Received!*\n\n` +
            `New Stock: ${result.balance.quantity} units\n` +
            `New Avg Cost: ₦${dec(result.balance.averageCost).toFixed(2)}`
          );
        }

        if (action.actionType === PendingActionType.STOCK_TRANSFER) {
          const transfer = await this.inventoryService.transferStock(
            ctx.business.id,
            ctx.user.id,
            {
              sourceLocationId: payload.sourceLocationId,
              destinationLocationId: payload.destinationLocationId,
              items: payload.items,
            },
          );
          return `✅ *Stock Transfer Complete!*\n\nTransfer #: ${transfer.transferNumber}\nStatus: COMPLETED`;
        }

        return '⚠️ Unknown action type.';
      } catch (err: any) {
        await tx.pendingAction.update({
          where: { id: action.id },
          data: { status: PendingActionStatus.PENDING },
        });
        throw err;
      }
    });
  }

  async cancelAction(userId: string, actionIdPrefix: string): Promise<void> {
    await this.prisma.$executeRaw`
      UPDATE pending_actions
      SET status = 'cancelled'
      WHERE "userId" = ${userId}::uuid
        AND status = 'pending'
        AND id::text LIKE ${`${actionIdPrefix}%`}
    `;
  }

  async expireOldActions(): Promise<void> {
    await this.prisma.pendingAction.updateMany({
      where: {
        status: PendingActionStatus.PENDING,
        expiresAt: { lt: new Date() },
      },
      data: { status: PendingActionStatus.EXPIRED },
    });
  }
}
