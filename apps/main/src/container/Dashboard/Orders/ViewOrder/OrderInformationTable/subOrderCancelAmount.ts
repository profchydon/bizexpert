import { ISubOrder } from "@/types/orders";

export function calculateSubOrderTotalAmount(subOrder?: ISubOrder): string {
  if (subOrder?.amount !== undefined && subOrder.amount !== "") {
    return String(subOrder.amount);
  }

  const assets = subOrder?.assets || [];
  if (assets.length > 0) {
    const total = assets.reduce((sum, asset) => {
      const assetAmount = parseFloat(asset.asset_pricing?.amount || "0");
      return sum + assetAmount;
    }, 0);
    if (total > 0) {
      return total.toString();
    }
  }

  if (subOrder?.equipment?.purchase_price) {
    return subOrder.equipment.purchase_price;
  }

  return "0";
}
