import React from "react";
import { ProductDetail } from "@raydahq/marketplace-ui";
import { IAsset } from "@/types/assets";
import { InclusivePriceNote } from "@/components/Tax/InclusivePriceNote";
import RichText from "@/components/ui/rich-text";
import { isRichTextEmpty } from "@/utils/sanitizeHtml";
import RfqCartNotice from "../RfqCartNotice";
import { mapAssetToMarketplaceProduct } from "../utils/mapAssetToMarketplaceProduct";
import { product_1 } from "@/assets/images";

interface Props {
  assetDetail: IAsset;
  assetSpecs: string;
  specId?: string;
  selectedCountryCode?: string;
  selectedCountryLabel?: string;
  deliveryEstimate: string;
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
  onSelectSpec: (specId: string) => void;
}

const Details: React.FC<Props> = ({
  assetDetail,
  assetSpecs,
  specId,
  selectedCountryCode,
  selectedCountryLabel,
  deliveryEstimate,
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
  onSelectSpec,
}) => {
  const product = mapAssetToMarketplaceProduct(assetDetail);
  if (!product) return null;
  const title = [
    assetDetail?.name,
    assetDetail?.make,
    assetDetail?.model,
    assetSpecs,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ProductDetail
      product={product}
      title={title}
      specId={specId}
      countryBadge={{ code: selectedCountryCode, label: selectedCountryLabel }}
      deliveryEstimate={deliveryEstimate}
      assetExistsInCart={assetExistsInCart}
      assetQuantity={assetQuantity}
      isAddToCartLoading={isAddToCartLoading}
      disableAddToCart={hasRfqItemsInCart}
      disableQuantityControls={disableQuantityControls}
      isFavorited={isFavorited}
      onAddToCart={onAddToCart}
      onIncrement={onIncrement}
      onDecrement={onDecrement}
      onUpdateQuantity={onUpdateQuantity}
      onToggleFavorite={onToggleFavorite}
      onSelectSpec={onSelectSpec}
      priceNote={<InclusivePriceNote />}
      belowActionsSlot={hasRfqItemsInCart ? <RfqCartNotice /> : undefined}
      fallbackImageSrc={product_1.src}
      descriptionSlot={
        isRichTextEmpty(assetDetail?.description) ? (
          <p className="max-w-[72ch] text-lg leading-8 font-normal text-gray-600">
            Built for day-to-day reliability, this device combines performance,
            portability, and enterprise-grade compatibility for distributed
            teams.
          </p>
        ) : (
          <RichText
            html={assetDetail?.description ?? ""}
            className="max-w-[72ch] text-lg leading-8 font-normal text-gray-600"
          />
        )
      }
    />
  );
};

export default Details;
