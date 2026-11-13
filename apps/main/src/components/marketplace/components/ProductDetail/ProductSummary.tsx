import type { ReactNode } from "react";
import { Heart, Truck } from "lucide-react";
import { cn } from "../../utils/cn";
import { formatAmount } from "../../utils/formatAmount";
import {
  resolveConditionBadgeColor,
  resolveConditionLabel,
} from "../../utils/spec";
import type {
  MarketplaceCountryBadge,
  MarketplacePrice,
  MarketplaceSpecEntry,
} from "../../types";
import { Badge, CountryBadge } from "../Badge";
import { PrimaryButton } from "../PrimaryButton";
import { QuantitySelector } from "../QuantitySelector";

export interface ProductSummaryProps {
  title: string;
  spec: MarketplaceSpecEntry[];
  status?: string;
  countryBadge?: MarketplaceCountryBadge;
  deliveryEstimate?: string;
  price?: MarketplacePrice;
  assetExistsInCart: boolean;
  assetQuantity: number;
  isAddToCartLoading?: boolean;
  disableAddToCart?: boolean;
  disableQuantityControls?: boolean;
  isFavorited?: boolean;
  onAddToCart: () => void | Promise<void>;
  onIncrement: () => void | Promise<void>;
  onDecrement: () => void | Promise<void>;
  onUpdateQuantity: (value: number) => void | Promise<void>;
  onToggleFavorite?: () => void;
  priceNote?: ReactNode;
  belowActionsSlot?: ReactNode;
}

export const ProductSummary = ({
  title,
  spec,
  status,
  countryBadge,
  deliveryEstimate,
  price,
  assetExistsInCart,
  assetQuantity,
  isAddToCartLoading,
  disableAddToCart,
  disableQuantityControls,
  isFavorited,
  onAddToCart,
  onIncrement,
  onDecrement,
  onUpdateQuantity,
  onToggleFavorite,
  priceNote,
  belowActionsSlot,
}: ProductSummaryProps) => {
  const conditionLabel = resolveConditionLabel(spec, status);
  const conditionColor = resolveConditionBadgeColor(conditionLabel);

  return (
    <div className="mp-flex mp-flex-col mp-gap-4">
      <div className="mp-flex mp-flex-wrap mp-gap-1.5">
        {countryBadge?.code && (
          <CountryBadge code={countryBadge.code} label={countryBadge.label} />
        )}
        <Badge color={conditionColor}>{conditionLabel}</Badge>
      </div>

      <h1 className="mp-break-words mp-text-xl mp-leading-[30px] mp-font-semibold mp-text-gray-900">
        {title}
      </h1>

      {deliveryEstimate && (
        <div className="mp-flex mp-items-center mp-gap-1 mp-text-[var(--mp-primary,#085DE8)]">
          <Truck className="mp-h-3 mp-w-3 mp-shrink-0" />
          <span className="mp-text-xs">
            Delivery estimate: {deliveryEstimate}
          </span>
        </div>
      )}

      <div className="mp-mt-1 mp-flex mp-flex-col mp-gap-3 sm:mp-flex-row sm:mp-flex-wrap sm:mp-items-center sm:mp-gap-4 xl:mp-flex-nowrap">
        <div className="mp-flex mp-shrink-0 mp-flex-col mp-gap-1">
          <h1 className="mp-text-[44px] mp-leading-none mp-font-semibold mp-tracking-[-0.02em] mp-text-gray-900">
            {price?.currency?.symbol}
            {formatAmount(price?.amount ?? 0)}
          </h1>
          {priceNote}
        </div>

        {onToggleFavorite && (
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={isFavorited}
            className={cn(
              "mp-inline-flex mp-h-12 mp-w-full mp-shrink-0 mp-items-center mp-justify-center mp-gap-2 mp-rounded-lg mp-border mp-bg-white mp-px-4 mp-text-base mp-font-semibold mp-transition sm:mp-w-auto sm:mp-min-w-[190px]",
              isFavorited
                ? "mp-border-[var(--mp-primary,#085DE8)] mp-text-[var(--mp-primary,#085DE8)]"
                : "mp-border-gray-200 mp-text-gray-700 hover:mp-border-gray-300 hover:mp-text-gray-900",
            )}
          >
            <Heart
              className={cn(
                "mp-h-4 mp-w-4 mp-text-gray-400",
                isFavorited &&
                  "mp-fill-[var(--mp-primary,#085DE8)] mp-text-[var(--mp-primary,#085DE8)]",
              )}
            />
            {isFavorited ? "Favorited" : "Add to Favorites"}
          </button>
        )}

        {!assetExistsInCart && (
          <div className="mp-flex mp-w-full mp-flex-col mp-gap-2 sm:mp-w-auto">
            <PrimaryButton
              size="lg"
              className="mp-w-full sm:mp-min-w-[240px]"
              disabled={isAddToCartLoading || disableAddToCart}
              onClick={onAddToCart}
            >
              Add to cart
            </PrimaryButton>
            {belowActionsSlot}
          </div>
        )}

        {assetExistsInCart && (
          <div className="mp-flex mp-shrink-0 mp-flex-col mp-items-start mp-gap-2">
            <QuantitySelector
              quantity={assetQuantity || 1}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              size="xl"
              disabled={disableQuantityControls || disableAddToCart}
              editable
              onQuantityCommit={onUpdateQuantity}
            />
            {belowActionsSlot}
          </div>
        )}
      </div>
    </div>
  );
};
