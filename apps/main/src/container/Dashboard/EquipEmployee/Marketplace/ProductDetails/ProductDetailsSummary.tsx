import { Button } from "@/components/ui/button";
import { Badge, BadgeWithFlag } from "@/components/base/badges/badges";
import { toBadgeFlag } from "@/components/base/badges/toBadgeFlag";
import { Heart, Truck } from "lucide-react";
import { InclusivePriceNote } from "@/components/Tax/InclusivePriceNote";
import formatAmount from "@/utils/formatAmount";
import { IAsset, IPrice, ISpecification } from "@/types/assets";
import { QuantitySelector } from "../QuantitySelector";
import { cn } from "@/lib/utils";
import RfqCartNotice from "../RfqCartNotice";

interface ProductDetailsSummaryProps {
  assetDetail: IAsset;
  assetSpecs: string;
  selectedCountryCode?: string;
  selectedCountryLabel?: string;
  currentSpec?: ISpecification;
  deliveryEstimate: string;
  currentPrice?: IPrice;
  assetExistsInCart: boolean;
  assetQuantity: number;
  isAddToCartLoading: boolean;
  hasRfqItemsInCart: boolean;
  disableQuantityControls: boolean;
  isFavorited: boolean;
  onAddToCart: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onUpdateQuantity: (value: number) => void;
  onToggleFavorite: () => void;
}

const ProductDetailsSummary: React.FC<ProductDetailsSummaryProps> = ({
  assetDetail,
  assetSpecs,
  selectedCountryCode,
  selectedCountryLabel,
  currentSpec,
  deliveryEstimate,
  currentPrice,
  assetExistsInCart,
  assetQuantity,
  isAddToCartLoading,
  hasRfqItemsInCart,
  disableQuantityControls,
  isFavorited,
  onAddToCart,
  onIncrement,
  onDecrement,
  onUpdateQuantity,
  onToggleFavorite,
}) => {
  const normalizedSpecCondition = currentSpec?.spec?.find((spec) => {
    const normalizedName = spec?.name
      ?.toLowerCase()
      .split(/\s+/)
      .join("_")
      .split("-")
      .join("_");

    return (
      normalizedName === "condition" || normalizedName === "spec_condition"
    );
  })?.value;

  const badgeLabel =
    normalizedSpecCondition ||
    (assetDetail as any)?.spec_condition ||
    (assetDetail as any)?.condition ||
    (assetDetail as any)?.state ||
    assetDetail?.status ||
    "Available";

  const stateBadgeColor = (() => {
    const normalized = badgeLabel.toLowerCase();
    if (normalized.includes("brand new") || normalized === "new") {
      return "blue" as const;
    }
    if (normalized.includes("refurb")) {
      return "purple" as const;
    }
    return "gray" as const;
  })();

  const countryFlag = toBadgeFlag(selectedCountryCode);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5">
        {countryFlag && (
          <BadgeWithFlag
            type="pill-color"
            size="sm"
            color="gray"
            flag={countryFlag}
          >
            {selectedCountryLabel}
          </BadgeWithFlag>
        )}

        <Badge type="pill-color" size="sm" color={stateBadgeColor}>
          {badgeLabel}
        </Badge>
      </div>

      <h1 className="break-words text-xl leading-[30px] font-semibold text-gray-900">
        {assetDetail?.name} {assetDetail?.make} {assetDetail?.model}{" "}
        {assetSpecs}
      </h1>

      <div className="flex items-center gap-1 text-primary-700">
        <Truck className="h-3 w-3 shrink-0" />
        <span className="text-xs">Delivery estimate: {deliveryEstimate}</span>
      </div>

      <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 xl:flex-nowrap">
        <div className="flex shrink-0 flex-col gap-1">
          <h1 className="text-[44px] leading-none font-semibold tracking-[-0.02em] text-gray-900">
            {currentPrice?.currency?.symbol}
            {formatAmount(currentPrice?.amount || "0")}
          </h1>
          <InclusivePriceNote />
        </div>

        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorited}
          className={cn(
            "inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-lg border bg-white px-4 text-base font-semibold transition sm:w-auto sm:min-w-[190px]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/30",
            isFavorited
              ? "border-primary-300 text-primary-700"
              : "border-primary-200 text-gray-700 hover:border-primary-300 hover:text-gray-900",
          )}
        >
          <Heart
            className={cn(
              "h-4 w-4 text-gray-400",
              isFavorited && "fill-primary-600 text-primary-600",
            )}
          />
          {isFavorited ? "Favorited" : "Add to Favorites"}
        </button>

        {!assetExistsInCart && (
          <div className="flex w-full flex-col gap-2 sm:w-auto">
            <Button
              type="button"
              size="lg"
              className="h-12 w-full text-base font-semibold sm:min-w-[240px]"
              disabled={isAddToCartLoading || hasRfqItemsInCart}
              onClick={onAddToCart}
              data-testid="productdetailssummary-button"
            >
              Add to cart
            </Button>
            {hasRfqItemsInCart && <RfqCartNotice />}
          </div>
        )}

        {assetExistsInCart && (
          <div className="flex shrink-0 flex-col items-start gap-2">
            <QuantitySelector
              quantity={assetQuantity || 1}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              size="xl"
              disabled={disableQuantityControls || hasRfqItemsInCart}
              editable
              onQuantityCommit={onUpdateQuantity}
            />
            {hasRfqItemsInCart && <RfqCartNotice />}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsSummary;
