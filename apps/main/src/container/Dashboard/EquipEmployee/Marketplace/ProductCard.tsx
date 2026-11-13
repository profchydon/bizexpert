import { IAsset } from "@/types/assets";
import { usePathname, useRouter } from "next/navigation";
import routes from "@/routes";
import createQueryString from "@/utils/createQueryString";
import useCart from "@/hooks/useCart";
import { useEffect } from "react";
import { InclusivePriceNote } from "@/components/Tax/InclusivePriceNote";
import formatAmount from "@/utils/formatAmount";
import { useAppSelector } from "@/store";
import { readCartCountryMap } from "@/hooks/cartCountryMemory";
import ProductCardDetails from "./ProductCardDetails";
import ProductCardMedia from "./ProductCardMedia";
import ProductCardPurchaseAction from "./ProductCardPurchaseAction";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import { formatDeliveryEstimate } from "./utils/formatDeliveryEstimate";
import { hasRfqCartItems } from "@/utils/cartItemSource";

interface Props {
  asset?: IAsset;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  disableQuantityBtn?: boolean;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const ProductCard: React.FC<Props> = ({
  asset,
  setIsLoading,
  disableQuantityBtn,
  isFavorited,
  onToggleFavorite,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const assetSpecs = asset?.spec.map((spec) => spec.value).join(" ");
  const {
    equipEmployee: { country },
  } = useAppSelector((state) => state.persistedReducers);
  const { data: countriesResponse } = useGetCountriesQuery();

  const countries =
    (countriesResponse?.data?.data as
      | Array<{
          id?: string;
          name?: string;
          code?: string;
          eta?: string | null;
        }>
      | undefined) ?? [];

  const {
    carts,
    isAddToCartLoading,
    isAddToCartSuccess,
    handleAddToCart,
    decrementItem,
    incrementItem,
    updateQty,
  } = useCart();

  const assetExistsInCart = carts.some(
    (item) => item.pricing.id === asset?.asset_pricing.id,
  );
  const assetQuantity = carts.find(
    (item) => item.pricing.id === asset?.asset_pricing.id,
  )?.quantity;
  const hasRfqItemsInCart = hasRfqCartItems(carts);

  useEffect(() => {
    if (isAddToCartSuccess) {
      setIsLoading(true);
    }
  }, [isAddToCartSuccess, setIsLoading]);

  const selectedCountryCode = country?.code?.toUpperCase();
  const selectedCountryLabel = country?.name;
  const selectedCountryEta = countries.find((item) => {
    if (country?.id && item?.id === country.id) {
      return true;
    }

    if (
      selectedCountryCode &&
      item?.code?.toUpperCase() === selectedCountryCode
    ) {
      return true;
    }

    return (
      (item?.name || "").toLowerCase() ===
      (selectedCountryLabel || "").toLowerCase()
    );
  })?.eta;
  const normalizedSpecCondition = asset?.spec?.find((spec) => {
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

  const assetState =
    normalizedSpecCondition ||
    (asset as any)?.spec_condition ||
    (asset as any)?.condition ||
    (asset as any)?.state ||
    asset?.status ||
    "Available";
  const rememberedDelivery = asset?.asset_pricing?.id
    ? readCartCountryMap()[asset.asset_pricing.id]?.eta
    : undefined;
  const deliveryEstimate = formatDeliveryEstimate(
    selectedCountryEta || rememberedDelivery,
  );

  const stateBadgeColor = (() => {
    const normalized = assetState.toLowerCase();
    if (normalized.includes("brand new") || normalized === "new") {
      return "blue" as const;
    }

    if (normalized.includes("refurbished")) {
      return "purple" as const;
    }

    return "gray" as const;
  })();

  const onOpenDetails = () => {
    if (disableQuantityBtn) {
      router.push(
        `${routes.EQUIP_EMPLOYEE_MARKETPLACE}/${asset?.asset_id}?${createQueryString("specId", asset?.asset_spec_id!)}&device-refresh=true&single-instance=true`,
      );
      return;
    }
    router.push(
      `${routes.EQUIP_EMPLOYEE_MARKETPLACE}/${asset?.asset_id}?${createQueryString("specId", asset?.asset_spec_id!)}`,
    );
  };

  return (
    <div className="flex h-full flex-col gap-6 overflow-clip rounded-2xl border border-gray-100 bg-white p-3">
      <ProductCardMedia
        asset={asset}
        isFavorited={isFavorited}
        onOpenDetails={onOpenDetails}
        onToggleFavorite={onToggleFavorite}
      />

      <div className="flex flex-1 flex-col gap-3 px-3 pb-3">
        <ProductCardDetails
          selectedCountryCode={selectedCountryCode}
          selectedCountryLabel={selectedCountryLabel}
          assetState={assetState}
          stateBadgeColor={stateBadgeColor}
          pathname={pathname}
          assetId={asset?.asset_id}
          assetSpecId={asset?.asset_spec_id}
          assetName={asset?.name}
          assetSpecs={assetSpecs}
          deliveryEstimate={deliveryEstimate}
        />

        <div className="mt-auto flex items-center justify-between">
          <span className="flex flex-col text-lg font-bold text-gray-900">
            <span>
              {asset?.asset_pricing.currency.symbol}
              {formatAmount(asset?.asset_pricing.amount!)}
            </span>
            <InclusivePriceNote />
          </span>

          <ProductCardPurchaseAction
            asset={asset}
            assetExistsInCart={assetExistsInCart}
            assetQuantity={assetQuantity}
            hasRfqItemsInCart={hasRfqItemsInCart}
            isAddToCartLoading={isAddToCartLoading}
            disableQuantityBtn={disableQuantityBtn}
            onAddToCart={(selectedAsset, pricingId) =>
              handleAddToCart({ asset: selectedAsset, pricingId })
            }
            onIncrement={incrementItem}
            onDecrement={decrementItem}
            onUpdateQuantity={updateQty}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
