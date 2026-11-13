import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { IAsset } from "@/types/assets";
import { ICart } from "@/types/cart";
import {
  FavoritesFilterBanner,
  MarketplaceEmptyState,
  ProductCard,
} from "@raydahq/marketplace-ui";
import Image from "next/image";
import { search_asset_img } from "@/assets/images";
import HolidayBanner from "./HolidayBanner";
import Pagination from "@/components/Custom/Pagination";
import RfqCartNotice from "./RfqCartNotice";
import { InclusivePriceNote } from "@/components/Tax/InclusivePriceNote";
import { hasRfqCartItems } from "@/utils/cartItemSource";
import { mapAssetToMarketplaceProduct } from "./utils/mapAssetToMarketplaceProduct";
import type { MarketplaceLogistics } from "./types/marketplaceLogistics";
import {
  CountryEtaLookup,
  SelectedCountry,
  resolveDeliveryEstimate,
} from "./utils/countryDeliveryEstimate";

export interface MarketplaceProductsSectionProps {
  displayAssets?: IAsset[];
  isLoading: boolean;
  disableQuantityBtn: boolean;
  favorites: Set<string>;
  showFavoritesOnly: boolean;
  countryCode?: string;
  countryName?: string;
  logistics?: MarketplaceLogistics | null;
  currentPage: number;
  lastPage: number;
  onToggleFavorite: (id: string) => void;
  onClearFilters: () => Promise<void>;
  onOpenCustomRequest: () => void;
  onPageChange: (page: number) => void;
  onDismissFavoritesOnly: () => void;
  carts: ICart[];
  selectedCountry?: SelectedCountry;
  countries: CountryEtaLookup[];
  isAddToCartLoading: boolean;
  pathname: string;
  onOpenProductDetails: (asset?: IAsset) => void;
  onAddToCart: (asset: IAsset, pricingId: string) => Promise<void>;
  onIncrement: (pricingId: string) => Promise<void>;
  onDecrement: (pricingId: string) => Promise<void>;
  onUpdateQuantity: (pricingId: string, value: number) => Promise<void>;
}

const MarketplaceProductsSection: React.FC<MarketplaceProductsSectionProps> = ({
  displayAssets,
  isLoading,
  disableQuantityBtn,
  favorites,
  showFavoritesOnly,
  countryCode,
  countryName,
  logistics,
  currentPage,
  lastPage,
  onToggleFavorite,
  onClearFilters,
  onOpenCustomRequest,
  onPageChange,
  onDismissFavoritesOnly,
  carts,
  selectedCountry,
  countries,
  isAddToCartLoading,
  pathname,
  onOpenProductDetails,
  onAddToCart,
  onIncrement,
  onDecrement,
  onUpdateQuantity,
}) => {
  const hasRfqItemsInCart = hasRfqCartItems(carts);
  const selectedCountryCode = selectedCountry?.code?.toUpperCase();
  const selectedCountryLabel = selectedCountry?.name;

  return (
    <>
      <FavoritesFilterBanner
        show={showFavoritesOnly}
        count={displayAssets?.length ?? 0}
        onDismiss={onDismissFavoritesOnly}
      />

      <HolidayBanner logistics={logistics} />

      {hasRfqItemsInCart && (
        <RfqCartNotice className="rounded-lg border border-error-200 bg-error-50 px-4 py-2 text-sm text-error-700" />
      )}

      <div
        className={
          displayAssets?.length === 0
            ? "flex flex-col"
            : "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
        }
      >
        {displayAssets?.map((asset) => {
          const pricingId = asset?.asset_pricing?.id;
          const assetExistsInCart = carts.some(
            (item) => item.pricing.id === pricingId,
          );
          const assetQuantity = carts.find(
            (item) => item.pricing.id === pricingId,
          )?.quantity;
          const deliveryEstimate = resolveDeliveryEstimate(
            pricingId,
            selectedCountry,
            countries,
          );
          const product = mapAssetToMarketplaceProduct(asset);
          if (!product) return null;

          return (
            <div
              key={asset?.asset_spec_id ?? asset?.id}
              className={cn(isLoading && "pointer-events-none")}
            >
              <ProductCard
                product={product}
                disableQuantityControls={disableQuantityBtn}
                disableAddToCart={hasRfqItemsInCart}
                isFavorited={favorites.has(product.id)}
                onToggleFavorite={onToggleFavorite}
                onOpenDetails={() => onOpenProductDetails(asset)}
                countryBadge={{
                  code: selectedCountryCode,
                  label: selectedCountryLabel,
                }}
                deliveryEstimate={deliveryEstimate}
                assetExistsInCart={assetExistsInCart}
                assetQuantity={assetQuantity}
                isAddToCartLoading={isAddToCartLoading}
                onAddToCart={() => onAddToCart(asset, pricingId!)}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onUpdateQuantity={onUpdateQuantity}
                priceNote={<InclusivePriceNote />}
              />
            </div>
          );
        })}

        {displayAssets?.length === 0 && (
          <MarketplaceEmptyState
            onClearFilters={onClearFilters}
            onOpenCustomRequest={onOpenCustomRequest}
            emptyStateImageSlot={
              <Image
                src={search_asset_img}
                alt="emptyState"
                className="mx-auto"
              />
            }
          />
        )}
      </div>

      {displayAssets?.length !== 0 && <Separator />}

      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default MarketplaceProductsSection;
