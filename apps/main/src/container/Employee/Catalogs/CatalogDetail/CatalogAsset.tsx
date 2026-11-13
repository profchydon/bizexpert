import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { IAsset } from "@/types/assets";
import React, { useEffect } from "react";
import useCart from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { InclusivePriceNote } from "@/components/Tax/InclusivePriceNote";
import formatAmount from "@/utils/formatAmount";
import { handleUnexpectedAsyncError } from "@/utils/handleUnexpectedAsyncError";

interface Props {
  asset: IAsset;
  setIsLoading: (value: boolean) => void;
  assetPercentage: number;
  budgetLimit?: number;
  catalogType?: "budget" | "device";
  categories?: { name: string; quantity: number }[];
  selectedCountByCategory?: Record<string, number>;
}
const CatalogAsset: React.FC<Props> = ({
  asset,
  setIsLoading,
  assetPercentage,
  budgetLimit,
  catalogType,
  categories,
  selectedCountByCategory,
}) => {
  const assetSpecs = Object.values(asset.spec).join(" ");

  const {
    carts,
    isAddToCartLoading,
    isAddToCartSuccess,
    handleAddToCart,
    removeItemFromCart,
    removeAllItemsFromCart,
  } = useCart();

  const assetExistsInCart = carts.some(
    (item) => item.pricing.id === asset?.asset_pricing.id,
  );

  const categoryLimit =
    categories?.find((c) => c.name === asset.category)?.quantity ?? Infinity;
  const cartItemsInCategory = selectedCountByCategory?.[asset.category] ?? 0;
  const isCategoryLimitReached =
    !assetExistsInCart && cartItemsInCategory >= categoryLimit;

  const toggleAddtoCart = async () => {
    try {
      if (!assetExistsInCart) {
        await handleAddToCart({ asset, pricingId: asset.asset_pricing.id });
      } else {
        await removeItemFromCart(asset.asset_pricing.id);
      }
    } catch (error) {
      handleUnexpectedAsyncError(error, "Unable to update cart");
    }
  };

  useEffect(() => {
    if (isAddToCartLoading || isAddToCartSuccess) {
      setIsLoading(true);
    }
  }, [isAddToCartLoading, isAddToCartSuccess]);

  useEffect(() => {
    if (!assetExistsInCart) {
      removeAllItemsFromCart();
    }
  }, [assetExistsInCart]);

  return (
    <Card
      className={cn(
        "cursor-pointer",
        assetExistsInCart && "border border-primary-600",
        isAddToCartLoading && "pointer-events-none opacity-75",
        budgetLimit === 0 && "pointer-events-none opacity-45",
        !budgetLimit && "pointer-events-none opacity-45",
        isCategoryLimitReached && "pointer-events-none opacity-45",
      )}
      onClick={toggleAddtoCart}
    >
      <CardHeader>
        <div className="grid place-content-center min-h-[120px] max-h-[120px]">
          {asset.images?.[0] ? (
            <img
              src={asset.images[0]}
              alt={asset.name}
              className="object-contain"
              width={150}
              height={160}
            />
          ) : (
            <span className="text-gray-400 text-sm">No available image</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 flex flex-col gap-y-4">
        <h3
          className="text-gray-900 font-semibold text-sm line-clamp-2"
          title={`${asset?.name} ${assetSpecs}`}
        >
          {asset?.name} {assetSpecs}
        </h3>
      </CardContent>
      <CardFooter className="p-4">
        <div className="h-full w-full flex justify-between">
          <div className="flex flex-col gap-y-1">
            {catalogType === "budget" ? (
              <>
                <span className="text-gray-400 text-xs">Price</span>
                <span className="text-gray-900 text-sm font-semibold">
                  {asset.asset_pricing?.currency?.symbol ?? "$"}
                  {formatAmount(String(asset.asset_pricing?.amount ?? 0))}
                </span>
                <InclusivePriceNote />
              </>
            ) : (
              <>
                <span className="text-gray-400 text-xs">Budget percentage</span>
                {budgetLimit || budgetLimit! > 0 ? (
                  <span className="text-gray-900 text-sm font-semibold">
                    {assetPercentage.toFixed(2)}%
                  </span>
                ) : (
                  "0%"
                )}
              </>
            )}
          </div>

          <div>
            <Checkbox
              checked={assetExistsInCart}
              disabled={isCategoryLimitReached}
              data-testid="catalogasset-checkbox"
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CatalogAsset;
