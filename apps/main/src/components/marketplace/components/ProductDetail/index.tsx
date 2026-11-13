"use client";

import type { ReactNode } from "react";
import type { MarketplaceCountryBadge, MarketplaceProduct } from "../../types";
import { resolveProductGalleryImages } from "../../utils/galleryImages";
import { ProductGallery } from "./ProductGallery";
import { ProductSummary } from "./ProductSummary";
import { SpecificationOptionGroups } from "./SpecificationOptionGroups";
import { TechnicalSpecificationsTable } from "./TechnicalSpecificationsTable";

export interface ProductDetailProps {
  product: MarketplaceProduct;
  title: string;
  specId?: string;
  countryBadge?: MarketplaceCountryBadge;
  deliveryEstimate?: string;
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
  onSelectSpec: (specId: string) => void;
  priceNote?: ReactNode;
  belowActionsSlot?: ReactNode;
  /** App-rendered description (e.g. Remote's sanitized rich-text renderer). */
  descriptionSlot?: ReactNode;
  fallbackImageSrc?: string;
}

export { ProductGallery } from "./ProductGallery";
export { ProductSummary } from "./ProductSummary";
export { SpecificationOptionGroups } from "./SpecificationOptionGroups";
export { TechnicalSpecificationsTable } from "./TechnicalSpecificationsTable";

export const ProductDetail = ({
  product,
  title,
  specId,
  countryBadge,
  deliveryEstimate,
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
  onSelectSpec,
  priceNote,
  belowActionsSlot,
  descriptionSlot,
  fallbackImageSrc,
}: ProductDetailProps) => {
  const currentSpec = product.specifications?.find(
    (spec) => spec.id === specId,
  );
  const galleryImages = resolveProductGalleryImages(product, specId);

  return (
    <div className="mp-root mp-mt-2 mp-flex mp-flex-col mp-gap-8 lg:mp-flex-row lg:mp-items-start">
      <ProductGallery
        key={currentSpec?.id ?? specId ?? product.id}
        images={galleryImages}
        alt={product.name}
        fallbackImageSrc={fallbackImageSrc}
      />

      <section className="mp-w-full mp-min-w-0 lg:mp-flex-1">
        <ProductSummary
          title={title}
          spec={currentSpec?.spec ?? product.spec}
          status={product.status}
          countryBadge={countryBadge}
          deliveryEstimate={deliveryEstimate}
          price={currentSpec?.price ?? product.price}
          assetExistsInCart={assetExistsInCart}
          assetQuantity={assetQuantity}
          isAddToCartLoading={isAddToCartLoading}
          disableAddToCart={disableAddToCart}
          disableQuantityControls={disableQuantityControls}
          isFavorited={isFavorited}
          onAddToCart={onAddToCart}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onUpdateQuantity={onUpdateQuantity}
          onToggleFavorite={onToggleFavorite}
          priceNote={priceNote}
          belowActionsSlot={belowActionsSlot}
        />

        {descriptionSlot && (
          <>
            <hr className="mp-mt-6 mp-border-gray-200" />
            <div className="mp-my-7">
              <h3 className="mp-mb-3 mp-text-[18px] mp-leading-6 mp-font-semibold mp-tracking-[0.12em] mp-text-gray-700 mp-uppercase">
                Description
              </h3>
              {descriptionSlot}
            </div>
          </>
        )}

        <hr className="mp-border-gray-200" />

        <div className="mp-mt-6 mp-flex mp-flex-col mp-gap-y-5">
          <div>
            <h3 className="mp-mb-3 mp-text-base mp-font-semibold mp-text-gray-900">
              Specifications
            </h3>

            <SpecificationOptionGroups
              productName={product.name}
              specifications={product.specifications}
              specId={specId}
              onSelectSpec={onSelectSpec}
            />
          </div>

          <TechnicalSpecificationsTable spec={currentSpec?.spec} />
        </div>
      </section>
    </div>
  );
};
