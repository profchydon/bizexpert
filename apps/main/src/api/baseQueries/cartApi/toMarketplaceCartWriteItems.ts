import type { ICart } from "@/types/cart";
import type { MarketplaceCartWriteItem } from "./cartLineTypes";

export function toMarketplaceCartWriteItems(
  carts: ICart[],
): MarketplaceCartWriteItem[] {
  return carts.map((item) => ({
    asset_pricing_id: item.pricing.id,
    quantity: Number(item.quantity),
  }));
}
