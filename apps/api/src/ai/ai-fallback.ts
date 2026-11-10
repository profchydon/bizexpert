import { Business, User } from "@prisma/client";
import { AnalyticsService } from "../analytics/analytics.service";
import { periodToRange } from "./ai-period";

export async function runAiFallback(
  message: string,
  ctx: { user: User; business: Business },
  analyticsService: AnalyticsService,
): Promise<string> {
  const lower = message.toLowerCase();
  const businessId = ctx.business.id;

  if (
    lower.includes("today") ||
    lower.includes("sell") ||
    lower.includes("sale") ||
    lower.includes("revenue")
  ) {
    const range = periodToRange("today");
    const summary = await analyticsService.getSalesSummary(businessId, range);
    return (
      `**Today's Sales Summary**\n\n` +
      `Revenue: ₦${summary.totalRevenue.toLocaleString()}\n` +
      `Profit: ₦${summary.grossProfit.toLocaleString()}\n` +
      `Sales: ${summary.completedSalesCount}\n` +
      `Margin: ${summary.grossMarginPct}%`
    );
  }

  if (
    lower.includes("stock") ||
    lower.includes("restock") ||
    lower.includes("low")
  ) {
    const alerts = await analyticsService.getLowStockAlerts(businessId);
    if (!alerts.length) return "All products are adequately stocked.";
    return (
      `**Low Stock Alert**\n\n` +
      alerts
        .slice(0, 10)
        .map(
          (a: { productName?: string; currentStock?: number }) =>
            `- ${a.productName}: ${a.currentStock} left`,
        )
        .join("\n")
    );
  }

  if (
    lower.includes("inventory") ||
    lower.includes("value") ||
    lower.includes("valuation")
  ) {
    const val = await analyticsService.getInventoryValuation(businessId);
    return (
      `**Inventory Valuation**\n\n` +
      `Total Value: ₦${val.totalValue.toLocaleString()}\n` +
      `Products tracked: ${val.items.length}`
    );
  }

  return (
    `Hi ${ctx.user.name}. I'm your BizExpert assistant.\n\n` +
    `You can ask me:\n` +
    `- "How much did I sell today?"\n` +
    `- "Which products need restocking?"\n` +
    `- "What is my inventory value?"\n` +
    `- Record a sale, receive stock, or transfer stock (I'll preview first).\n\n` +
    `For full conversation support, set OPENAI_API_KEY.`
  );
}
