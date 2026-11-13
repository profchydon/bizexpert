"use client";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { companyBillingCurrencySymbol } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import PageState from "@/components/PageState";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import PageHeader from "@/components/PageHeader";
import { useParams, useRouter } from "next/navigation";
import { useGetCatalogQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCatalogAssetsQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalogAssets";
import CatalogAsset from "./CatalogAsset";
import Pagination from "@/components/Custom/Pagination";
import { cn } from "@/lib/utils";
import useCart from "@/hooks/useCart";
import formatAmount from "@/utils/formatAmount";
import displayErrorMessage from "@/utils/displayErrorMessage";
import EmployeeCartOverview from "@/components/Drawers/EmployeeCartOverview";
import routes from "@/routes";
import { trackEmployeeCatalogViewed } from "@/lib/employeePortalAnalytics";

const CatalogDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const catalogId = id as string;

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [isEmployeeCartOverviewOpen, setIsEmployeeCartOverviewOpen] =
    useState(false);

  const { getCompanyDetails, getUserDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const billingSymbol = companyBillingCurrencySymbol(company);
  const user = getUserDetails();

  const { totalAmount, carts } = useCart();

  const {
    data: assetsRes,
    isLoading: isAssetsLoading,
    isError: isAssetsError,
  } = useGetCatalogAssetsQuery(
    { catalogId, companyId: company?.id!, page },
    { skip: !catalogId },
  );
  const assets = assetsRes?.data?.data ?? [];
  const currentPage = assetsRes?.data?.current_page ?? 1;
  const lastPage = assetsRes?.data.last_page ?? 1;

  const {
    data: catalogRes,
    isLoading: isCatalogLoading,
    isError: isCatalogError,
  } = useGetCatalogQuery(
    { companyId: company?.id!, catalogId },
    { skip: !catalogId },
  );
  const catalog = catalogRes?.data;

  // Build a pricingId → category lookup from all known assets so we don't
  // rely on cart API returning asset.category
  const allKnownAssets = [...(catalog?.assets?.data ?? []), ...assets];
  const pricingIdToCategoryMap = allKnownAssets.reduce<Record<string, string>>(
    (map, a) => {
      if (!map[a.asset_pricing.id]) map[a.asset_pricing.id] = a.category;
      return map;
    },
    {},
  );
  const selectedCountByCategory = carts.reduce<Record<string, number>>(
    (map, item) => {
      const category =
        pricingIdToCategoryMap[item.pricing.id] ?? item.asset?.category;
      if (category) map[category] = (map[category] ?? 0) + item.quantity;
      return map;
    },
    {},
  );

  function calculatePercentage(value: number, budgetLimit: number) {
    return (value / budgetLimit) * 100;
  }

  const budgetCalc = () => {
    if (
      !catalog?.config?.budget_limit ||
      Number(catalog?.config?.budget_limit) === 0
    ) {
      return 0;
    } else {
      return calculatePercentage(
        totalAmount ?? 0,
        Number(catalog?.config?.budget_limit) ?? 0,
      );
    }
  };
  const budgetCounterPercentage = budgetCalc();

  const onProceed = () => {
    if (catalog?.type === "budget" || budgetCounterPercentage <= 100) {
      setIsEmployeeCartOverviewOpen(true);
    }
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
    if (catalog?.type !== "budget" && budgetCounterPercentage > 100) {
      displayErrorMessage(
        "Budget exceeded",
        "Kindly pick assets within the limit to continue. ",
      );
    }
  }, [budgetCounterPercentage, catalog?.type]);

  useEffect(() => {
    if (catalogId && catalog) {
      trackEmployeeCatalogViewed();
    }
  }, [catalog, catalogId]);

  return (
    <PageState isError={isCatalogError} isLoading={isCatalogLoading}>
      {catalog && (
        <div className="flex flex-col gap-y-6">
          <PageHeader
            pageTitle={catalog.name}
            pageDescription={catalog.description}
            extraDescription={
              <div className="flex gap-x-2 items-center mt-3">
                <Badge variant={"blue"}>{catalog.levels[0]?.name}</Badge>
                {catalog.departments.map((dept) => (
                  <Badge variant={"blue"}>{dept.name}</Badge>
                ))}
              </div>
            }
            onBack={() => router.back()}
          >
            <div className="w-[348px] flex flex-col gap-y-4 bg-gray-100 p-6 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                Budget counter
              </div>
              <div className="flex flex-col gap-y-2">
                {catalog.type === "budget" ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {billingSymbol}
                        {formatAmount(String(totalAmount ?? 0))} spent
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {catalog.config?.budget_limit
                          ? `${billingSymbol}${formatAmount(catalog.config.budget_limit)}`
                          : "Not configured"}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-1">
                      <Progress
                        indicatorClassName={
                          budgetCounterPercentage > 100
                            ? "bg-error-700"
                            : undefined
                        }
                        value={
                          budgetCounterPercentage > 100
                            ? 100
                            : budgetCounterPercentage
                        }
                        className="w-full h-[8px] bg-gray-200"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {budgetCounterPercentage.toFixed(0)}%
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-x-1">
                      <Progress
                        indicatorClassName={
                          budgetCounterPercentage > 100
                            ? "bg-error-700"
                            : undefined
                        }
                        value={
                          budgetCounterPercentage > 100
                            ? 100
                            : budgetCounterPercentage
                        }
                        className="w-full h-[8px] bg-gray-200"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {budgetCounterPercentage.toFixed(0)}%
                    </span>
                  </>
                )}
              </div>
            </div>
          </PageHeader>

          <div className="space-y-6 border-l p-6 pt-0">
            <div className="flex items-center w-fit gap-x-3">
              {/* <Input
                placeholder="Search"
                className="w-[50ch]"
                startAdornment={<SearchIcon />}
                data-testid="catalogdetail-input"
              /> */}

              <Button
                disabled={
                  (catalog?.type !== "budget" &&
                    budgetCounterPercentage > 100) ||
                  !catalog?.config?.budget_limit ||
                  Number(catalog?.config?.budget_limit) === 0 ||
                  carts?.length === 0
                }
                onClick={onProceed}
                data-testid="catalogdetail-button"
              >
                Continue
              </Button>
            </div>

            <Separator />

            <PageState isLoading={isAssetsLoading} isError={isAssetsError}>
              <div
                className={cn(
                  "grid grid-cols-4 gap-6",
                  isLoading && "pointer-events-none",
                  (!catalog?.config?.budget_limit ||
                    Number(catalog?.config?.budget_limit) === 0) &&
                    "pointer-events-none",
                )}
              >
                {assets.length > 0 &&
                  assets?.map((asset) => (
                    <CatalogAsset
                      key={asset.asset_pricing.id}
                      asset={asset}
                      setIsLoading={(value) => setIsLoading(value)}
                      budgetLimit={Number(catalog?.config?.budget_limit)}
                      catalogType={catalog?.type}
                      categories={catalog?.categories}
                      selectedCountByCategory={selectedCountByCategory}
                      assetPercentage={
                        catalog?.config?.budget_limit ||
                        Number(catalog?.config?.budget_limit) !== 0
                          ? calculatePercentage(
                              Number(asset.asset_pricing.amount),
                              Number(catalog?.config?.budget_limit),
                            )
                          : 0
                      }
                    />
                  ))}
              </div>

              {assets.length === 0 && (
                <div className="col-span-4">
                  <EmptyTableInstance
                    description="Please contact admin to add items to catalog"
                    title="No items yet"
                  />
                </div>
              )}

              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={(value) => setPage(value)}
              />
            </PageState>
          </div>
        </div>
      )}

      <EmployeeCartOverview
        isOpen={isEmployeeCartOverviewOpen}
        onClose={() => setIsEmployeeCartOverviewOpen(false)}
        budgetLimitPercentage={budgetCounterPercentage}
        budgetLimit={catalog?.config?.budget_limit!}
        catalog={catalog!}
      />
    </PageState>
  );
};

export default CatalogDetail;
