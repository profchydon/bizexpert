"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Heart, Truck } from "lucide-react";
import { cn } from "../utils/cn";
import { formatAmount } from "../utils/formatAmount";
import {
  getSpecPreview,
  resolveConditionBadgeColor,
  resolveConditionLabel,
} from "../utils/spec";
import type { MarketplaceCountryBadge, MarketplaceProduct } from "../types";
import { Badge, CountryBadge } from "./Badge";
import { PrimaryButton } from "./PrimaryButton";
import { QuantitySelector } from "./QuantitySelector";

export interface ProductCardProps {
  product: MarketplaceProduct;
  countryBadge?: MarketplaceCountryBadge;
  deliveryEstimate?: string;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  onOpenDetails: (product: MarketplaceProduct) => void;
  assetExistsInCart: boolean;
  assetQuantity?: number;
  isAddToCartLoading?: boolean;
  disableQuantityControls?: boolean;
  disableAddToCart?: boolean;
  onAddToCart: (
    product: MarketplaceProduct,
    pricingId: string,
  ) => void | Promise<void>;
  onIncrement: (pricingId: string) => void | Promise<void>;
  onDecrement: (pricingId: string) => void | Promise<void>;
  onUpdateQuantity: (pricingId: string, value: number) => void | Promise<void>;
  /** Slot for an app-specific tax note (e.g. Remote/Partner's `InclusivePriceNote`). */
  priceNote?: ReactNode;
  /** Slot for an app-specific notice rendered below the purchase action (e.g. an RFQ-in-cart warning). */
  belowActionsSlot?: ReactNode;
  className?: string;
}

export const ProductCard = ({
  product,
  countryBadge,
  deliveryEstimate,
  isFavorited,
  onToggleFavorite,
  onOpenDetails,
  assetExistsInCart,
  assetQuantity,
  isAddToCartLoading,
  disableQuantityControls,
  disableAddToCart,
  onAddToCart,
  onIncrement,
  onDecrement,
  onUpdateQuantity,
  priceNote,
  belowActionsSlot,
  className,
}: ProductCardProps) => {
  const specPreview = getSpecPreview(product.spec, 4);
  const title = [product.name, specPreview].filter(Boolean).join(" ");
  const conditionLabel = resolveConditionLabel(product.spec, product.status);
  const conditionColor = resolveConditionBadgeColor(conditionLabel);
  const pricingId = product.price?.id ?? product.id;

  return (
    <div
      className={cn(
        "mp-root mp-flex mp-h-full mp-flex-col mp-gap-6 mp-overflow-clip mp-rounded-2xl mp-border mp-border-gray-200 mp-bg-white mp-p-3",
        className,
      )}
    >
      <div className="mp-relative mp-h-[156px] mp-w-full mp-overflow-clip mp-rounded-2xl mp-bg-gray-100">
        <button
          type="button"
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite?.(product.id);
          }}
          className={cn(
            "mp-absolute mp-top-2 mp-right-2 mp-z-10 mp-flex mp-h-8 mp-w-8 mp-items-center mp-justify-center mp-rounded-full mp-bg-white mp-border mp-border-gray-200 mp-shadow-sm mp-transition hover:mp-bg-gray-50",
            isFavorited &&
              "mp-ring-2 mp-ring-[var(--mp-primary-light,#D1E0FF)] mp-border-[var(--mp-primary,#085DE8)]",
          )}
        >
          <Heart
            className={cn(
              "mp-h-4 mp-w-4 mp-text-gray-500",
              isFavorited &&
                "mp-fill-[var(--mp-primary,#085DE8)] mp-text-[var(--mp-primary,#085DE8)]",
            )}
          />
        </button>

        <button
          type="button"
          className="mp-h-full mp-w-full"
          onClick={() => onOpenDetails(product)}
        >
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={220}
              height={156}
              className="mp-size-full mp-rounded-2xl mp-object-contain"
            />
          ) : (
            <div className="mp-flex mp-h-full mp-w-full mp-items-center mp-justify-center mp-text-xs mp-text-gray-500">
              No available image
            </div>
          )}
        </button>
      </div>

      <div className="mp-flex mp-flex-1 mp-flex-col mp-gap-4 mp-px-3 mp-pb-3">
        <div className="mp-flex mp-flex-col mp-gap-1.5">
          <div className="mp-flex mp-flex-wrap mp-gap-1.5">
            {countryBadge?.code && (
              <CountryBadge
                code={countryBadge.code}
                label={countryBadge.label}
              />
            )}
            <Badge color={conditionColor}>{conditionLabel}</Badge>
          </div>

          <button
            type="button"
            onClick={() => onOpenDetails(product)}
            className="mp-line-clamp-2 mp-text-left mp-text-sm mp-leading-5 mp-font-semibold mp-text-gray-900 mp-transition-colors hover:mp-text-[var(--mp-primary,#085DE8)]"
            title={title}
          >
            {title}
          </button>

          {deliveryEstimate && (
            <div className="mp-flex mp-items-center mp-gap-1 mp-text-[var(--mp-primary,#085DE8)]">
              <Truck className="mp-h-3.5 mp-w-3.5 mp-shrink-0" />
              <span className="mp-text-xs mp-font-medium">
                {deliveryEstimate}
              </span>
            </div>
          )}
        </div>

        <div className="mp-mt-auto mp-flex mp-items-center mp-justify-between">
          <div className="mp-flex mp-flex-col">
            <span className="mp-text-xs mp-text-gray-400">Price</span>
            <span className="mp-text-lg mp-font-semibold mp-text-gray-900">
              {product.price?.currency?.symbol}
              {formatAmount(product.price?.amount ?? 0)}
            </span>
            {priceNote}
          </div>

          {assetExistsInCart ? (
            <QuantitySelector
              size="lg"
              quantity={assetQuantity || 1}
              onIncrement={() => onIncrement(pricingId)}
              onDecrement={() => onDecrement(pricingId)}
              editable
              onQuantityCommit={(value) => onUpdateQuantity(pricingId, value)}
              disabled={
                disableQuantityControls ||
                isAddToCartLoading ||
                disableAddToCart
              }
            />
          ) : (
            <PrimaryButton
              size="sm"
              disabled={isAddToCartLoading || disableAddToCart}
              onClick={() => onAddToCart(product, pricingId)}
            >
              Add to cart
            </PrimaryButton>
          )}
        </div>

        {belowActionsSlot}
      </div>
    </div>
  );
};
