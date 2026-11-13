import React, { useEffect, useState } from "react";
import FilterActions from "./FilterActions";
import ProductCard from "./ProductCard";
import { Separator } from "@/components/ui/separator";
import SearchWithIcon from "@/components/SearchWithIcon";
import { Button } from "@/components/ui/button";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useLazyGetAssetsQuery } from "@/api/baseQueries/assetsApi/getAssets";
import PageState from "@/components/PageState";
import Pagination from "@/components/Custom/Pagination";
import EmptyAssetStateIntance from "./EmptyAssetState";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";
import { useGetCatalogQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalog";
import ItemSummary from "./ItemSummary";
import useCatalog from "@/hooks/useCatalog";
import { useUpdateCatalogConfigMutation } from "@/api/baseQueries/companiesApi/catalogsApi/updateCatalogConfig";
import { useAddCatalogConfigMutation } from "@/api/baseQueries/companiesApi/catalogsApi/addCatalogConfig";

const ProductsLayout = () => {
  const router = useRouter();
  const params = useSearchParams();
  const catalogId = params.get("catalogId") as string;

  const companyId = useWorkspaceCompanyId();
  const scopedCompanyId = companyId;

  const { data: catalogRes } = useGetCatalogQuery(
    {
      catalogId,
      companyId: scopedCompanyId!,
    },
    { skip: !catalogId || !scopedCompanyId },
  );

  const catalog = catalogRes?.data;

  const country = catalog?.countries?.[0];

  const { upperBoundaryTotal } = useCatalog(catalog!);

  const [updateCatalogConfig] = useUpdateCatalogConfigMutation();
  const [addCatalogConfig] = useAddCatalogConfigMutation();

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<string[]>([]);
  const [minPriceValue, setMinPriceValue] = useState("");
  const [maxPriceValue, setMaxPriceValue] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string | null>(null);
  const [searchProductValue] = useDebounce(search, 2000);

  const [isItemSummaryOpen, setIsItemSummaryOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [getAssets, getAssetsProps] = useLazyGetAssetsQuery();

  const assets = getAssetsProps.data?.data.data;
  const currentPage = getAssetsProps.data?.data.current_page ?? 1;
  const lastPage = getAssetsProps.data?.data.last_page ?? 1;

  const filterAsset = async (page: number = 1) => {
    if (!scopedCompanyId) return;

    setPage(page);
    await getAssets({
      companyId: scopedCompanyId,
      country_id: country?.id!,
      min_price:
        minPriceValue || Number(minPriceValue) !== 0
          ? minPriceValue
          : undefined,
      max_price:
        maxPriceValue || Number(maxPriceValue) !== 0
          ? maxPriceValue
          : undefined,
      type: selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
      category:
        selectedCategories.length > 0
          ? selectedCategories.join(",")
          : undefined,
      state: selectedState.length > 0 ? selectedState.join(",") : undefined,
      storage:
        selectedStorage.length > 0 ? selectedStorage.join(",") : undefined,
      RAM: selectedMemory.length > 0 ? selectedMemory.join(",") : undefined,
      page,
    });
  };

  const resetFilter = async () => {
    setSelectedTypes([]);
    setSelectedCategories([]);
    setSelectedState([]);
    setSelectedStorage([]);
    setSelectedMemory([]);
    setMinPriceValue("");
    setMaxPriceValue("");
    await getAssets({
      companyId: scopedCompanyId!,
      country_id: country?.id,
      min_price: undefined,
      max_price: undefined,
      type: undefined,
      category: undefined,
      state: undefined,
      storage: undefined,
      RAM: undefined,
      page: 1,
    });
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
    if (country?.id && scopedCompanyId) {
      getAssets({
        companyId: scopedCompanyId,
        country_id: country?.id,
        search: searchProductValue as string,
        page: page,
      });
    }
  }, [page, searchProductValue, country, scopedCompanyId]);

  const handleAddCatalog = async () => {
    const config = catalog?.config;
    const payload = {
      catalogId: catalog?.id!,
      companyId: scopedCompanyId!,
      budget_limit: String(upperBoundaryTotal),
      auto_share: config?.auto_share ?? false,
      time_limit: config?.time_limit ?? "1",
      time_duration: config?.time_duration ?? "days",
      auto_approve: (config as any)?.auto_approve ?? false,
    } as any;

    if (config) {
      await updateCatalogConfig(payload);
    } else {
      await addCatalogConfig(payload);
    }
  };

  useEffect(() => {
    const budgetLimit = catalog?.config?.budget_limit;
    if (!budgetLimit && upperBoundaryTotal) {
      handleAddCatalog();
    }
  }, [upperBoundaryTotal, catalog?.config?.budget_limit]);

  const handlePageChange = (page: number) => {
    filterAsset(page);
  };

  return (
    <PageState
      isLoading={getAssetsProps.isLoading}
      isError={getAssetsProps.isError}
    >
      <div className="mt-8 flex flex-row gap-x-8">
        <FilterActions
          currencySymbol={assets?.[0]?.asset_pricing?.currency?.symbol}
          priceRangeFilter={{
            minPriceValue,
            maxPriceValue,
            setMinPriceValue: (value) => setMinPriceValue(value),
            setMaxPriceValue: (value) => setMaxPriceValue(value),
          }}
          typeFilter={{
            selectedTypes,
            setSelectedTypes: (value) => setSelectedTypes(value),
          }}
          categoryFilter={{
            selectedCategories,
            setSelectedCategories: (value) => setSelectedCategories(value),
          }}
          stateFilter={{
            selectedState,
            setSelectedState: (value) => setSelectedState(value),
          }}
          storageFilter={{
            selectedStorage,
            setSelectedStorage: (value) => setSelectedStorage(value),
          }}
          memoryFilter={{
            selectedMemory,
            setSelectedMemory: (value) => setSelectedMemory(value),
          }}
          onApplyFilter={() => filterAsset(page)}
          isApplyFilterLoading={
            getAssetsProps.isLoading || getAssetsProps.isFetching
          }
          resetFilter={resetFilter}
        />
        <Separator orientation="vertical" className="h-auto hidden lg:block" />
        <main className="w-full lg:flex-1 flex flex-col gap-y-8">
          <div className="flex flex-row items-center gap-4">
            <SearchWithIcon
              className="w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="relative">
              <Button
                type="button"
                className="text-sm font-semibold w-full relative"
                variant="primary"
                disabled={catalog?.assets?.data?.length! <= 1}
                onClick={() => setIsItemSummaryOpen(true)}
                data-testid="productslayout-button"
              >
                <div className="absolute -right-3 h-6 w-6 -top-3 grid place-content-center rounded-full bg-error-600 text-white text-sm font-medium">
                  {catalog?.assets?.data.length}
                </div>
                Continue
              </Button>
            </div>
          </div>
          <Separator />
          <div
            className={
              assets?.length === 0
                ? "flex flex-col"
                : "grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 lg:gap-3 2xl:grid-cols-4"
            }
          >
            {assets?.map((asset) => (
              <div
                key={asset?.asset_spec_id}
                className={cn(isLoading && "pointer-events-none")}
              >
                <ProductCard
                  asset={asset}
                  isLoading={isLoading}
                  setIsLoading={(value) => setIsLoading(value)}
                  catalogId={catalogId}
                  catalog={catalog}
                />
              </div>
            ))}
            {assets?.length === 0 && (
              <EmptyAssetStateIntance
                handleClear={resetFilter}
                handleRequest={() =>
                  router.push("https://zfrmz.com/dU1biU1cn19DItJgzfrE")
                }
              />
            )}
          </div>
          {assets?.length !== 0 && <Separator />}

          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={(value) => handlePageChange(value)}
          />
        </main>
      </div>

      <ItemSummary
        isOpen={isItemSummaryOpen}
        onClose={() => setIsItemSummaryOpen(false)}
        catalog={catalog}
      />
    </PageState>
  );
};

export default ProductsLayout;
