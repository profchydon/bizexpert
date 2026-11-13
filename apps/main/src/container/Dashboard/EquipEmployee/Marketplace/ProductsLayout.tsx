import React, { useEffect, useRef, useState } from "react";
import { trackItemSourceSelected } from "@/lib/orderFlowAnalytics";
import dynamic from "next/dynamic";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useLazyGetAssetsQuery } from "@/api/baseQueries/assetsApi/getAssets";
import { useAppDispatch, useAppSelector } from "@/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import MarketplaceMainContent from "./MarketplaceMainContent";
import MarketplaceCountrySelector from "./MarketplaceCountrySelector";
import buildMarketplaceFilterProps from "./buildMarketplaceFilterProps";
import type { DeviceEntry } from "./CustomDeviceRequestModal/types";
import type { MarketplaceLogistics } from "./types/marketplaceLogistics";
import { useMarketplaceCreateRfqFromQuery } from "./useMarketplaceCreateRfqFromQuery";
import { setCountry } from "@/store/slices/equipEmployeeSlice";
import { setOfficePreseed } from "../AssignmentFlow/officePreseed";
import { useOfficeMarketplace } from "./useOfficeMarketplace";
import { useOfficeMarketplaceCountry } from "./useOfficeMarketplaceCountry";
import { withOfficeQuery } from "./officeMarketplace";
import {
  useAddAssetFavouriteMutation,
  useRemoveAssetFavouriteMutation,
} from "../../../../api/baseQueries/assetsApi/toggleAssetFavorite";
import useCart from "@/hooks/useCart";
import { useGetCountriesQuery } from "@/api/baseQueries/countriesApi/getCountries";
import routes from "@/routes";
import createQueryString from "@/utils/createQueryString";
import { IAsset } from "@/types/assets";
import { CountryEtaLookup } from "./utils/countryDeliveryEstimate";

const CustomDeviceRequestModal = dynamic(
  () =>
    import("./CustomDeviceRequestModal").then(
      (mod) => mod.CustomDeviceRequestModal,
    ),
  { ssr: false },
);

const ProductsLayout = () => {
  type AppliedFilterState = {
    minPriceValue: string;
    maxPriceValue: string;
    selectedTypes: string[];
    selectedState: string[];
    selectedStorage: string[];
    selectedMemory: string[];
    selectedOs: string[];
    selectedExtraFilters: Record<string, string[]>;
  };

  const companyId = useWorkspaceCompanyId();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const officeId = params.get("office");
  const { office } = useOfficeMarketplace();
  useEffect(() => {
    if (officeId) {
      setOfficePreseed(officeId);
    }
  }, [officeId]);
  const isDeviceRefreshInstance = Boolean(params.get("device-refresh"));
  const isDeviceRefreshSingleInstance = Boolean(params.get("single-instance"));
  const {
    equipEmployee: { country },
  } = useAppSelector((state) => state.persistedReducers);

  const {
    carts,
    isAddToCartLoading,
    isAddToCartSuccess,
    handleAddToCart,
    decrementItem,
    incrementItem,
    updateQty,
  } = useCart();
  const { data: countriesResponse } = useGetCountriesQuery();
  const countries =
    (countriesResponse?.data?.data as CountryEtaLookup[] | undefined) ?? [];
  useOfficeMarketplaceCountry(office, countries);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<string[]>([]);
  const [selectedOs, setSelectedOs] = useState<string[]>([]);
  const [selectedExtraFilters, setSelectedExtraFilters] = useState<
    Record<string, string[]>
  >({});
  const [minPriceValue, setMinPriceValue] = useState("");
  const [maxPriceValue, setMaxPriceValue] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilterState>({
    minPriceValue: "",
    maxPriceValue: "",
    selectedTypes: [],
    selectedState: [],
    selectedStorage: [],
    selectedMemory: [],
    selectedOs: [],
    selectedExtraFilters: {},
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string | null>(null);
  const [searchProductValue] = useDebounce(search, 2000);
  const [isCustomRequestOpen, setIsCustomRequestOpen] = useState(false);
  const [customRequestPrefill, setCustomRequestPrefill] = useState<
    DeviceEntry[] | undefined
  >();
  const [customRequestReturnHref, setCustomRequestReturnHref] = useState<
    string | undefined
  >();
  useMarketplaceCreateRfqFromQuery((session) => {
    if (session?.devices.length) {
      setCustomRequestPrefill(session.devices);
    }
    if (session?.returnHref) {
      setCustomRequestReturnHref(session.returnHref);
    }
    setIsCustomRequestOpen(true);
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [toastState, setToastState] = useState<{
    show: boolean;
    action: "added" | "removed";
  }>({
    show: false,
    action: "added",
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const [optimisticFavorites, setOptimisticFavorites] = useState<
    Record<string, boolean>
  >({});

  const [isLoading, setIsLoading] = useState(false);
  const [addAssetFavourite] = useAddAssetFavouriteMutation();
  const [removeAssetFavourite] = useRemoveAssetFavouriteMutation();

  const [getAssets, getAssetsProps] = useLazyGetAssetsQuery();
  const marketplaceSourceTrackedRef = useRef(false);

  useEffect(() => {
    if (marketplaceSourceTrackedRef.current) return;
    marketplaceSourceTrackedRef.current = true;
    trackItemSourceSelected("marketplace", "equip_employee");
  }, []);

  const toQueryValue = (values?: string[]) =>
    values && values.length > 0 ? values.join(",") : undefined;

  const toTextQueryValue = (value?: string) => {
    if (!value || value.length === 0) {
      return undefined;
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      return undefined;
    }

    return value;
  };

  const assets = getAssetsProps.data?.data.data;
  const apiFilters = getAssetsProps.data?.data?.filters as
    | {
        hard_drive?: string[];
        ram?: string[];
        state?: string[];
        os?: string[];
        processor?: string[];
        display?: string[];
        keyboard?: string[];
        power_adapter?: string[];
        warranty?: string[];
        spec_tier?: string[];
        colour?: string[];
        type?: Array<{ id?: string; name?: string }>;
        price_bounds?: {
          min_price?: number;
          max_price?: number;
        };
      }
    | undefined;
  const responseCountry = getAssetsProps.data?.data?.country as
    | { id?: string; name?: string; code?: string }
    | undefined;
  const logistics = getAssetsProps.data?.data?.logistics as
    | MarketplaceLogistics
    | undefined;

  const typeOptions = (apiFilters?.type ?? [])
    .filter((item): item is { id: string; name: string } =>
      Boolean(item?.id && item?.name),
    )
    .map((item) => ({ id: item.id, name: item.name }));

  const priceBounds = {
    min: apiFilters?.price_bounds?.min_price ?? 0,
    max: apiFilters?.price_bounds?.max_price ?? 1000000,
  };
  const displayAssets = assets;
  const favorites = new Set(
    (assets ?? [])
      .filter((asset) => {
        const id = asset?.asset_spec_id ?? asset?.id;
        if (id && optimisticFavorites[id] !== undefined) {
          return optimisticFavorites[id];
        }
        return asset?.is_favourite;
      })
      .map((asset) => asset?.asset_spec_id ?? asset?.id)
      .filter(Boolean),
  );
  const currentPage = getAssetsProps.data?.data.current_page ?? 1;
  const lastPage = getAssetsProps.data?.data.last_page ?? 1;

  const handleToggleFavorite = async (
    assetSpecId: string,
    isFavorited: boolean,
  ) => {
    if (!assetSpecId) {
      return;
    }

    const action = isFavorited ? "removed" : "added";

    // Optimistically update the UI
    setOptimisticFavorites((prev) => ({
      ...prev,
      [assetSpecId]: !isFavorited,
    }));

    try {
      if (isFavorited) {
        await removeAssetFavourite({
          companyId: companyId!,
          assetSpecId,
        }).unwrap();
      } else {
        await addAssetFavourite({
          companyId: companyId!,
          assetSpecId,
        }).unwrap();
      }

      setPulseKey((current) => current + 1);
      setToastState({
        show: true,
        action,
      });
    } catch {
      // Revert optimistic update on failure
      setOptimisticFavorites((prev) => {
        const next = { ...prev };
        delete next[assetSpecId];
        return next;
      });
      return;
    }
  };

  const applyFilters = (nextPage: number = 1) => {
    setPage(nextPage);
    setAppliedFilters({
      minPriceValue,
      maxPriceValue,
      selectedTypes: [...selectedTypes],
      selectedState: [...selectedState],
      selectedStorage: [...selectedStorage],
      selectedMemory: [...selectedMemory],
      selectedOs: [...selectedOs],
      selectedExtraFilters: { ...selectedExtraFilters },
    });
  };

  const resetFilter = async () => {
    setSelectedTypes([]);
    setSelectedState([]);
    setSelectedStorage([]);
    setSelectedMemory([]);
    setSelectedOs([]);
    setSelectedExtraFilters({});
    setMinPriceValue("");
    setMaxPriceValue("");
    setAppliedFilters({
      minPriceValue: "",
      maxPriceValue: "",
      selectedTypes: [],
      selectedState: [],
      selectedStorage: [],
      selectedMemory: [],
      selectedOs: [],
      selectedExtraFilters: {},
    });
    setPage(1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (isAddToCartSuccess) {
      setIsLoading(true);
    }
  }, [isAddToCartSuccess]);

  const disableQuantityBtn =
    isDeviceRefreshInstance && isDeviceRefreshSingleInstance;

  const openProductDetails = (asset?: IAsset) => {
    if (!asset?.asset_id) {
      return;
    }

    if (disableQuantityBtn) {
      router.push(
        withOfficeQuery(
          `${routes.EQUIP_EMPLOYEE_MARKETPLACE}/${asset.asset_id}?${createQueryString("specId", asset.asset_spec_id!)}&device-refresh=true&single-instance=true`,
          officeId,
        ),
      );
      return;
    }

    router.push(
      withOfficeQuery(
        `${routes.EQUIP_EMPLOYEE_MARKETPLACE}/${asset.asset_id}?${createQueryString("specId", asset.asset_spec_id!)}`,
        officeId,
      ),
    );
  };

  useEffect(() => {
    if (!companyId) return;

    getAssets({
      companyId,
      country_id: country?.id,
      min_price: toTextQueryValue(appliedFilters.minPriceValue),
      max_price: toTextQueryValue(appliedFilters.maxPriceValue),
      type: toQueryValue(appliedFilters.selectedTypes),
      state: toQueryValue(appliedFilters.selectedState),
      hard_drive: toQueryValue(appliedFilters.selectedStorage),
      storage: toQueryValue(appliedFilters.selectedStorage),
      ram: toQueryValue(appliedFilters.selectedMemory),
      RAM: toQueryValue(appliedFilters.selectedMemory),
      os: toQueryValue(appliedFilters.selectedOs),
      processor: toQueryValue(appliedFilters.selectedExtraFilters.processor),
      display: toQueryValue(appliedFilters.selectedExtraFilters.display),
      keyboard: toQueryValue(appliedFilters.selectedExtraFilters.keyboard),
      power_adapter: toQueryValue(
        appliedFilters.selectedExtraFilters.power_adapter,
      ),
      warranty: toQueryValue(appliedFilters.selectedExtraFilters.warranty),
      spec_tier: toQueryValue(appliedFilters.selectedExtraFilters.spec_tier),
      colour: toQueryValue(appliedFilters.selectedExtraFilters.colour),
      search: searchProductValue as string,
      favourites: showFavoritesOnly || undefined,
      page: page,
    });
  }, [
    companyId,
    page,
    searchProductValue,
    country?.id,
    appliedFilters,
    showFavoritesOnly,
  ]);

  useEffect(() => {
    if (country?.id) {
      return;
    }

    if (
      !responseCountry?.id &&
      !responseCountry?.name &&
      !responseCountry?.code
    ) {
      return;
    }

    dispatch(
      setCountry({
        id: responseCountry?.id,
        name: responseCountry?.name,
        code: responseCountry?.code,
      }),
    );
  }, [
    dispatch,
    country?.id,
    responseCountry?.id,
    responseCountry?.name,
    responseCountry?.code,
  ]);

  const sharedFilterProps = buildMarketplaceFilterProps({
    currencySymbol: assets?.[0]?.asset_pricing?.currency?.symbol,
    minPriceValue,
    maxPriceValue,
    priceBounds,
    setMinPriceValue,
    setMaxPriceValue,
    selectedTypes,
    setSelectedTypes,
    selectedState,
    setSelectedState,
    selectedStorage,
    setSelectedStorage,
    selectedMemory,
    setSelectedMemory,
    selectedOs,
    setSelectedOs,
    isApplyFilterLoading: getAssetsProps.isLoading,
    showFavoritesOnly,
    favoritesCount: favorites.size,
    onToggleFavoritesOnly: setShowFavoritesOnly,
    filterOptions: {
      type: typeOptions,
      state: apiFilters?.state,
      hardDrive: apiFilters?.hard_drive,
      ram: apiFilters?.ram,
      os: apiFilters?.os,
      processor: apiFilters?.processor,
      display: apiFilters?.display,
      keyboard: apiFilters?.keyboard,
      powerAdapter: apiFilters?.power_adapter,
      warranty: apiFilters?.warranty,
      specTier: apiFilters?.spec_tier,
      colour: apiFilters?.colour,
    },
    selectedExtraFilters,
    onChangeExtraFilter: (key, value) =>
      setSelectedExtraFilters((prev) => ({
        ...prev,
        [key]: value,
      })),
    pulseKey,
  });

  return (
    <MarketplaceMainContent
      isCatalogLoading={getAssetsProps.isLoading}
      isCatalogError={getAssetsProps.isError}
      filterProps={sharedFilterProps}
      isMobileFilterOpen={isMobileFilterOpen}
      onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
      onCloseMobileFilter={() => setIsMobileFilterOpen(false)}
      onApplyDesktopFilter={async () => applyFilters(1)}
      onResetDesktopFilter={async () => await resetFilter()}
      onApplyMobileFilter={async () => {
        applyFilters(1);
        setIsMobileFilterOpen(false);
      }}
      onResetMobileFilter={async () => {
        await resetFilter();
        setIsMobileFilterOpen(false);
      }}
      search={search}
      onSearchChange={(value) => setSearch(value)}
      onOpenCustomRequest={() => {
        trackItemSourceSelected("rfq", "equip_employee");
        setIsCustomRequestOpen(true);
      }}
      countrySelectorSlot={<MarketplaceCountrySelector />}
      displayAssets={displayAssets}
      isLoading={isLoading}
      disableQuantityBtn={disableQuantityBtn}
      favorites={favorites}
      showFavoritesOnly={showFavoritesOnly}
      countryCode={responseCountry?.code ?? country?.code}
      countryName={responseCountry?.name ?? country?.name}
      logistics={logistics}
      currentPage={currentPage}
      lastPage={lastPage}
      onToggleFavorite={async (id) => {
        const targetAsset = (displayAssets ?? []).find(
          (item) => (item?.asset_spec_id ?? item?.id) === id,
        );

        const resolvedAssetSpecId =
          targetAsset?.asset_spec_id ?? targetAsset?.id;
        await handleToggleFavorite(
          resolvedAssetSpecId ?? "",
          Boolean(targetAsset?.is_favourite),
        );
      }}
      onPageChange={setPage}
      onDismissFavoritesOnly={() => setShowFavoritesOnly(false)}
      carts={carts}
      selectedCountry={country}
      countries={countries}
      isAddToCartLoading={isAddToCartLoading}
      pathname={pathname}
      onOpenProductDetails={openProductDetails}
      onAddToCart={(asset, pricingId) => handleAddToCart({ asset, pricingId })}
      onIncrement={incrementItem}
      onDecrement={decrementItem}
      onUpdateQuantity={updateQty}
      isCustomRequestOpen={isCustomRequestOpen}
      onCustomRequestOpenChange={(open) => {
        setIsCustomRequestOpen(open);
        if (!open) {
          setCustomRequestPrefill(undefined);
          setCustomRequestReturnHref(undefined);
        }
      }}
      customRequestPrefill={customRequestPrefill}
      customRequestReturnHref={customRequestReturnHref}
      CustomDeviceRequestModal={CustomDeviceRequestModal}
      toastState={toastState}
      onDismissToast={() =>
        setToastState((previous) => ({
          ...previous,
          show: false,
        }))
      }
      onViewFavorites={() => {
        setShowFavoritesOnly(true);
        setToastState((previous) => ({
          ...previous,
          show: false,
        }));
      }}
    />
  );
};

export default ProductsLayout;
