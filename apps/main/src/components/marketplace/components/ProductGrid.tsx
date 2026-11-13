import { cn } from "../utils/cn";
import type { MarketplaceProduct } from "../types";
import { ProductCard, type ProductCardProps } from "./ProductCard";

export interface ProductGridProps extends Omit<
  ProductCardProps,
  "product" | "priceNote" | "belowActionsSlot"
> {
  products: MarketplaceProduct[];
  className?: string;
  /** Resolve per-product overrides (e.g. delivery estimate, favorite state, price/RFQ note slots) not covered by the shared props above. */
  getItemProps?: (
    product: MarketplaceProduct,
  ) => Partial<
    Pick<
      ProductCardProps,
      | "deliveryEstimate"
      | "isFavorited"
      | "assetExistsInCart"
      | "assetQuantity"
      | "priceNote"
      | "belowActionsSlot"
    >
  >;
}

export const ProductGrid = ({
  products,
  className,
  getItemProps,
  ...sharedProps
}: ProductGridProps) => (
  <div
    className={cn(
      "mp-grid mp-grid-cols-1 mp-gap-5 sm:mp-grid-cols-2 xl:mp-grid-cols-3",
      className,
    )}
  >
    {products.map((product) => (
      <ProductCard
        key={product.specId ?? product.id}
        product={product}
        {...sharedProps}
        {...getItemProps?.(product)}
      />
    ))}
  </div>
);
