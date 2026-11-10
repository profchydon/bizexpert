import { Logger } from "@nestjs/common";
import { Business, User, WhatsappIdentity } from "@prisma/client";
import { AnalyticsService } from "../analytics/analytics.service";
import { InventoryService } from "../inventory/inventory.service";
import { PendingActionsService } from "../pending-actions/pending-actions.service";
import { periodToRange } from "./ai-period";
import { stripEmojis } from "./strip-emojis";

export type AiToolContext = {
  user: User;
  business: Business;
  identity: WhatsappIdentity;
};

type Deps = {
  analyticsService: AnalyticsService;
  pendingActionsService: PendingActionsService;
  inventoryService: InventoryService;
  logger: Logger;
};

export async function executeAiTool(
  toolName: string,
  args: any,
  ctx: AiToolContext,
  deps: Deps,
): Promise<string> {
  const businessId = ctx.business.id;
  try {
    switch (toolName) {
      case "get_sales_summary": {
        const range = periodToRange(args.period);
        const locId = args.location_name
          ? (
              await deps.pendingActionsService.resolveLocationByName(
                businessId,
                args.location_name,
              )
            )?.id
          : undefined;
        const summary = await deps.analyticsService.getSalesSummary(
          businessId,
          {
            ...range,
            locationId: locId,
          },
        );
        return JSON.stringify(summary);
      }
      case "get_product_stock": {
        const product = await deps.pendingActionsService.resolveProductByName(
          businessId,
          args.product_name,
        );
        if (!product) {
          return JSON.stringify({
            error: `Product "${args.product_name}" not found`,
          });
        }
        const locId = args.location_name
          ? (
              await deps.pendingActionsService.resolveLocationByName(
                businessId,
                args.location_name,
              )
            )?.id
          : undefined;
        const balances = await deps.inventoryService.getLocationBalances(
          businessId,
          locId,
        );
        const productBalances = balances.filter(
          (b) => b.productId === product.id,
        );
        return JSON.stringify({
          product: product.name,
          balances: productBalances.map((b) => ({
            location: (b as { location?: { name?: string } }).location?.name,
            quantity: b.quantity,
            unit: product.baseUnit,
            averageCost: b.averageCost,
          })),
        });
      }
      case "get_low_stock_alerts": {
        const locId = args.location_name
          ? (
              await deps.pendingActionsService.resolveLocationByName(
                businessId,
                args.location_name,
              )
            )?.id
          : undefined;
        const alerts = await deps.analyticsService.getLowStockAlerts(
          businessId,
          locId,
        );
        return JSON.stringify(alerts.slice(0, 15));
      }
      case "get_inventory_valuation": {
        const locId = args.location_name
          ? (
              await deps.pendingActionsService.resolveLocationByName(
                businessId,
                args.location_name,
              )
            )?.id
          : undefined;
        const valuation = await deps.analyticsService.getInventoryValuation(
          businessId,
          locId,
        );
        return JSON.stringify({
          totalValue: valuation.totalValue,
          itemCount: valuation.items.length,
        });
      }
      case "preview_sale":
        return stripEmojis(
          await deps.pendingActionsService.previewSale(ctx, args),
        );
      case "preview_stock_receipt":
        return stripEmojis(
          await deps.pendingActionsService.previewStockReceipt(ctx, args),
        );
      case "preview_stock_transfer":
        return stripEmojis(
          await deps.pendingActionsService.previewStockTransfer(ctx, args),
        );
      case "confirm_pending_action":
        return stripEmojis(
          await deps.pendingActionsService.confirmAction(ctx, args.action_id),
        );
      case "cancel_pending_action":
        await deps.pendingActionsService.cancelAction(
          ctx.user.id,
          args.action_id,
        );
        return "Action cancelled.";
      default:
        return JSON.stringify({ error: `Unknown tool: ${toolName}` });
    }
  } catch (err: any) {
    deps.logger.error(`Tool ${toolName} error: ${err.message}`);
    return JSON.stringify({ error: err.message });
  }
}
