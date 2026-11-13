import type { Product } from "@/types/bizexpert";
import type { SaleFormValues } from "./saleSchema";

export function applyProductToSaleItems(
  items: SaleFormValues["items"],
  product: Product,
): SaleFormValues["items"] {
  const nextItem: SaleFormValues["items"][number] = {
    productId: product.id,
    quantity: 1,
    unitName: product.baseUnit ?? "",
    unitPrice: Number(product.sellingPrice) || "",
    discountAmount: 0,
  };
  const emptyIndex = items.findIndex((item) => !item.productId);
  if (emptyIndex < 0) return [...items, nextItem];
  return items.map((item, index) => (index === emptyIndex ? nextItem : item));
}
