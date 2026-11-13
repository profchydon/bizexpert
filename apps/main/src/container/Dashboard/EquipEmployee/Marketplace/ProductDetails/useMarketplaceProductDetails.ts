"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetAssetQuery } from "@/api/baseQueries/assetsApi/getAsset";
import {
  useAddAssetFavouriteMutation,
  useRemoveAssetFavouriteMutation,
} from "@/api/baseQueries/assetsApi/toggleAssetFavorite";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import useCart from "@/hooks/useCart";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCountry } from "@/store/slices/equipEmployeeSlice";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { hasRfqCartItems } from "@/utils/cartItemSource";
import createQueryString from "@/utils/createQueryString";
import {
  CountryEtaLookup,
  resolveDeliveryEstimate,
} from "../utils/countryDeliveryEstimate";
import {
  isMarketplaceProductDetailsPending,
  marketplaceAssetCountryId,
  marketplaceDisplayCountry,
  marketplacePricingId,
  resolveMarketplaceSpecification,
  specificationSummary,
} from "./marketplaceProductDetailsState";

export function useMarketplaceProductDetails() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const assetId = params.id as string;
  const specId = searchParams.get("specId") ?? undefined;
  const disableQuantityControls =
    Boolean(searchParams.get("device-refresh")) &&
    Boolean(searchParams.get("single-instance"));

  const dispatch = useAppDispatch();
  const companyId = useWorkspaceCompanyId();
  const companyCountry = useAuthUserDetail().getCompanyDetails()?.country;
  const country = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.country,
  );
  const countryId = marketplaceAssetCountryId(country?.id, companyCountry?.id);
  const selectedCountry = marketplaceDisplayCountry(country, companyCountry);

  useEffect(() => {
    if (country?.id || !companyCountry?.id) return;
    dispatch(
      setCountry({
        id: companyCountry.id,
        name: companyCountry.name,
        code: companyCountry.code,
      }),
    );
  }, [
    companyCountry?.code,
    companyCountry?.id,
    companyCountry?.name,
    country?.id,
    dispatch,
  ]);

  const {
    data: assetDetailRes,
    isLoading,
    isError,
  } = useGetAssetQuery(
    { companyId: companyId!, country_id: countryId!, assetId },
    { skip: !companyId || !countryId || !assetId },
  );
  const assetDetail = assetDetailRes?.data;
  const currentSpec = resolveMarketplaceSpecification(
    assetDetail?.specifications,
    specId,
  );
  const assetSpecs = specificationSummary(currentSpec);
  const pricingId = marketplacePricingId(
    currentSpec,
    assetDetail?.asset_pricing?.id,
  );
  const assetSpecId =
    currentSpec?.id ?? assetDetail?.asset_spec_id ?? assetDetail?.id;

  const {
    carts,
    isAddToCartLoading,
    handleAddToCart,
    decrementItem,
    incrementItem,
    updateQty,
  } = useCart();
  const { data: countriesResponse } = useGetCountriesQuery();
  const countries =
    (countriesResponse?.data?.data as CountryEtaLookup[] | undefined) ?? [];

  const [addAssetFavourite] = useAddAssetFavouriteMutation();
  const [removeAssetFavourite] = useRemoveAssetFavouriteMutation();

  const onToggleFavorite = async () => {
    if (!assetSpecId) return;
    try {
      if (assetDetail?.is_favourite) {
        await removeAssetFavourite({
          companyId: companyId!,
          assetSpecId,
        }).unwrap();
        return;
      }
      await addAssetFavourite({ companyId: companyId!, assetSpecId }).unwrap();
    } catch {
      return;
    }
  };

  return {
    isLoading:
      isLoading ||
      isMarketplaceProductDetailsPending({
        hasAsset: Boolean(assetDetail),
        isError,
      }),
    isError,
    productTitle: `${assetDetail?.name || "Product"} ${assetSpecs}`.trim(),
    detailsProps: {
      assetDetail: assetDetail!,
      assetSpecs,
      specId: currentSpec?.id ?? specId,
      selectedCountryCode: selectedCountry?.code,
      selectedCountryLabel: selectedCountry?.name,
      deliveryEstimate: resolveDeliveryEstimate(
        pricingId,
        selectedCountry,
        countries,
      ),
      assetExistsInCart: carts.some((item) => item.pricing.id === pricingId),
      assetQuantity:
        carts.find((item) => item.pricing.id === pricingId)?.quantity ?? 0,
      isAddToCartLoading,
      hasRfqItemsInCart: hasRfqCartItems(carts),
      disableQuantityControls,
      isFavorited: Boolean(assetDetail?.is_favourite),
      onAddToCart: () => {
        if (!assetDetail || !pricingId) return;
        return handleAddToCart({ asset: assetDetail, pricingId });
      },
      onIncrement: () => {
        if (!pricingId) return;
        return incrementItem(pricingId);
      },
      onDecrement: () => {
        if (!pricingId) return;
        return decrementItem(pricingId);
      },
      onUpdateQuantity: (value: number) => {
        if (!pricingId) return;
        return updateQty(pricingId, value);
      },
      onToggleFavorite,
      onSelectSpec: (nextSpecId: string) => {
        router.push(
          `?${createQueryString("specId", nextSpecId, searchParams)}`,
          {
            scroll: false,
          },
        );
      },
    },
  };
}
