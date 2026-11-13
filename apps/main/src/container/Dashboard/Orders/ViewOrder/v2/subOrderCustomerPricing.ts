import { IAsset } from "@/types/assets";
import { ISubOrder } from "@/types/orders";

export function parseCustomerPrice(value?: string | number | null): number {
  if (value === undefined || value === null || value === "") return 0;
  const parsed =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function assetCustomerPrice(asset: IAsset): number {
  return parseCustomerPrice(asset.asset_pricing?.amount);
}

export function subOrderCustomerAmount(subOrder: ISubOrder): number {
  const fromTotal = parseCustomerPrice(
    (subOrder as { total_amount?: string | number }).total_amount,
  );
  if (fromTotal > 0) return fromTotal;

  const assets = subOrder.assets ?? [];
  if (assets.length > 0) {
    const fromAssets = assets.reduce(
      (total, asset) => total + assetCustomerPrice(asset),
      0,
    );
    if (fromAssets > 0) return fromAssets;
  }

  const fromAmount = parseCustomerPrice(subOrder.amount);
  if (fromAmount > 0) return fromAmount;

  const subOrderType = String(
    (subOrder as { type?: string }).type ?? "",
  ).toLowerCase();
  if (subOrderType === "buy_to_storage" || subOrderType === "renew_storage") {
    return 0;
  }

  return parseCustomerPrice(subOrder.equipment?.purchase_price);
}
