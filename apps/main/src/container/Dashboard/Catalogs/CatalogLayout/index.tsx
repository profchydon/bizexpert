import { Card, CardContent, CardFooter } from "@/components/ui/card";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import CatalogActions from "./catalogActions";
import { useRouter } from "next/navigation";
import routes from "@/routes";
import Pagination from "@/components/Custom/Pagination";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useGetCatalogsQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalogs";
import PageState from "@/components/PageState";
import ReactCountryFlag from "react-country-flag";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import CreateCatalog from "../CreateCatalogs";
import { ICatalog } from "@/types/catalog";
import ConfigureCatalog from "../ViewCatalog/ConfigureCatalog";
import ItemQuantityConfig from "../ViewCatalog/ConfigureCatalog/ItemQuantityConfig";
import { cn } from "@/lib/utils";
import ShareCatalogDrawer from "../ViewCatalog/ShareCatalogDrawer";
import { companyBillingCurrencySymbol } from "@/utils/companyBillingCurrency";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import CatalogBudgetAmount from "./CatalogBudgetAmount";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CatalogLayoutProps {
  catalogType?: "device" | "budget";
}

const CatalogLayout: React.FC<CatalogLayoutProps> = ({ catalogType }) => {
  const router = useRouter();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const billingSymbol = companyBillingCurrencySymbol(company);
  const companyId = useWorkspaceCompanyId();

  const [editCatalogData, setEditCatalogData] = useState<ICatalog>();
  const [shareCatalogData, setShareCatalogData] = useState<ICatalog>();
  const [duplicateCatalogData, setDuplicateCatalogData] = useState<ICatalog>();
  const [configureCatalogData, setConfigureCatalogData] = useState<ICatalog>();
  const [itemConfigCatalogData, setItemConfigCatalogData] =
    useState<ICatalog>();
  const [viewCountriesCatalog, setViewCountriesCatalog] = useState<ICatalog>();

  const selectedCatalogData =
    editCatalogData ??
    duplicateCatalogData ??
    configureCatalogData ??
    itemConfigCatalogData;

  const [page, setPage] = useState<number>();

  const {
    data: catalogRes,
    isLoading,
    isError,
  } = useGetCatalogsQuery({
    companyId: companyId!,
    page: page!,
    type: catalogType,
  });
  const catalogs = catalogRes?.data.data ?? [];
  const currentPage = catalogRes?.data?.current_page ?? 1;
  const lastPage = catalogRes?.data?.last_page ?? 1;

  const getStatusBadge = (status: ICatalog["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="success" className="text-success-700">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge
            variant="gray"
            className="text-gray-700 border border-gray-200"
          >
            Inactive
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="destructive" className="text-red-700">
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  const getBudgetDisplay = (catalog: ICatalog) => {
    const budgetLimit = catalog.config?.budget_limit;
    if (!budgetLimit) return null;

    return <CatalogBudgetAmount amount={budgetLimit} symbol={billingSymbol} />;
  };

  return (
    <div>
      <PageState isLoading={isLoading} isError={isError}>
        <div className="grid gap-y-6 lg:grid-cols-3 gap-x-6">
          {catalogs.length > 0 &&
            catalogs.map((catalog) => (
              <div key={catalog.id}>
                <Card
                  className={cn(
                    "flex flex-col h-full cursor-pointer hover:shadow-sm transition-shadow",
                    selectedCatalogData?.id === catalog.id &&
                      "border border-primary-600 shadow-md",
                  )}
                  onClick={() =>
                    router.push(`${routes.CATALOGS}/${catalog.id}`)
                  }
                >
                  <CardContent className="p-5 flex flex-grow flex-col">
                    <div className="flex flex-col gap-y-2">
                      {/* Status badge + Actions row */}
                      <div className="flex flex-row justify-between items-start">
                        {getStatusBadge(catalog.status)}
                        <div onClick={(e) => e.stopPropagation()}>
                          <CatalogActions
                            viewHref={`${routes.CATALOGS}/${catalog.id}`}
                            onEdit={() => setEditCatalogData(catalog)}
                            onDuplicate={() => setDuplicateCatalogData(catalog)}
                            onConfigure={() => setConfigureCatalogData(catalog)}
                            onShare={() => setShareCatalogData(catalog)}
                          />
                        </div>
                      </div>

                      {/* Departments */}
                      {catalog?.departments.length > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          Departments:{" "}
                          {catalog?.departments
                            .map((dep) => dep.name)
                            .join(", ")}
                        </p>
                      )}

                      {/* Budget display for budget catalogs */}
                      {getBudgetDisplay(catalog)}

                      {/* Catalog name + Level badge */}
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                          {catalog.name}
                        </h3>
                        {catalog.levels?.length > 0 &&
                          catalog.levels.slice(0, 2).map((level) => (
                            <Badge
                              key={level.id}
                              variant="blue_border"
                              className="text-xs font-medium whitespace-nowrap"
                            >
                              {level.name}
                            </Badge>
                          ))}
                        {catalog.levels?.length > 2 && (
                          <Badge
                            variant="blue_border"
                            className="text-xs font-medium whitespace-nowrap"
                          >
                            +{catalog.levels.length - 2}
                          </Badge>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {catalog.description}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 pb-5 px-5">
                    <div className="flex flex-row items-center gap-2">
                      {catalog.countries && catalog.countries.length > 0 && (
                        <>
                          {catalog.countries
                            .slice(0, catalog.countries.length > 4 ? 3 : 4)
                            .map((country) => (
                              <div
                                key={country.id}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-gray-200 bg-white shrink-0"
                              >
                                <ReactCountryFlag
                                  countryCode={country.code || ""}
                                  svg
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    borderRadius: "50%",
                                  }}
                                />
                                <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                                  {country.name}
                                </span>
                              </div>
                            ))}
                          {catalog.countries.length > 4 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewCountriesCatalog(catalog);
                              }}
                              className="px-3 py-1 rounded-full border border-primary-200 bg-primary-50 hover:bg-primary-100 transition-colors text-xs font-medium text-primary-700 shrink-0 whitespace-nowrap"
                            >
                              +{catalog.countries.length - 3} More
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}

          {catalogs.length === 0 && (
            <div className="col-span-3 grid place-content-center py-10">
              <EmptyTableInstance
                description="Create new catalogs"
                title="No catalogs available"
              />
            </div>
          )}

          <div className="col-span-3">
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={(page) => setPage(page)}
            />
          </div>
        </div>
      </PageState>

      <CreateCatalog
        isOpen={Boolean(editCatalogData || duplicateCatalogData)}
        editCatalogData={editCatalogData}
        duplicateCatalogData={duplicateCatalogData}
        onClose={() => {
          setEditCatalogData(undefined);
          setDuplicateCatalogData(undefined);
        }}
      />

      <ConfigureCatalog
        isOpen={Boolean(configureCatalogData)}
        onClose={() => setConfigureCatalogData(undefined)}
        catalog={configureCatalogData}
        onOpenQtyConfig={() => setItemConfigCatalogData(configureCatalogData)}
      />

      <ItemQuantityConfig
        catalog={itemConfigCatalogData}
        isOpen={Boolean(itemConfigCatalogData)}
        onClose={() => setItemConfigCatalogData(undefined)}
      />

      <ShareCatalogDrawer
        isOpen={Boolean(shareCatalogData)}
        onClose={() => setShareCatalogData(undefined)}
        catalog={shareCatalogData}
      />

      <Dialog
        open={Boolean(viewCountriesCatalog)}
        onOpenChange={(open) => !open && setViewCountriesCatalog(undefined)}
        data-testid="cataloglayout-dialog"
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              All Countries ({viewCountriesCatalog?.countries?.length ?? 0})
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {viewCountriesCatalog?.countries?.map((country) => (
                <div
                  key={country.id}
                  className="flex items-center gap-x-2 py-1"
                >
                  <ReactCountryFlag
                    countryCode={country.code ?? ""}
                    svg
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                    }}
                  />
                  <span className="text-sm text-gray-700 truncate">
                    {country.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CatalogLayout;
