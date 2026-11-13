import React, { useMemo } from "react";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";

import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import routes from "@/routes";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import CatalogTableColumn from "./tableColumn";
import CatalogTableActions from "./tableAction";
import { IAsset } from "@/types/assets";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { ICatalog } from "@/types/catalog";
import { useParams, useRouter } from "next/navigation";
import { companyBillingCurrencySymbol } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useGetCatalogAssetsQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalogAssets";
import useCatalog from "@/hooks/useCatalog";
import PageState from "@/components/PageState";
import formatAmount from "@/utils/formatAmount";
import { useAppDispatch } from "@/store";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import { IEmployees } from "@/types/employees";
import { useGetAdminCatalogRequestsQuery } from "@/api/baseQueries/companiesApi/employeesApi/getAdminCatalogRequests";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

const CatalogTable: React.FC<{ catalog?: ICatalog }> = ({ catalog }) => {
  const router = useRouter();
  const catalogId = catalog?.id!;
  const dispatch = useAppDispatch();

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const billingSymbol = companyBillingCurrencySymbol(company);
  const companyId = useWorkspaceCompanyId();

  const {
    data: requestsRes,
    isError,
    isLoading,
  } = useGetAdminCatalogRequestsQuery(
    {
      companyId: companyId!,
      catalogId: catalog?.id!,
    },
    { skip: !catalog },
  );
  const requests = requestsRes?.data.requests ?? [];
  const approvedReqs = requests?.filter(
    (req) => req.status === "approved",
  ).length;

  const approveAllEmployees = requests
    .filter((req) => req.status === "pending")
    .map((req) => {
      const employees = req.employee;
      const newEmployees = {
        ...employees,
        items: req.items,
        requestId: req.id,
      } as IEmployees;
      return newEmployees;
    });

  const { page, setPage } = useTablePageQuery();

  const isDeviceCatalog = catalog?.type === "device";
  const isBudgetCatalog = catalog?.type === "budget";

  const {
    data: assetRes,
    isLoading: isAssetsLoading,
    isError: isAssetsError,
  } = useGetCatalogAssetsQuery(
    {
      catalogId,
      companyId: companyId!,
      page,
    },
    { skip: !isDeviceCatalog },
  );

  const assets = assetRes?.data.data ?? [];
  const currentPage = assetRes?.data.current_page ?? 1;
  const lastPage = assetRes?.data.last_page ?? 1;

  const { handleRemoveAsset, isRemoveAssetLoading } = useCatalog(catalog!);

  const columns: any = useMemo(
    () =>
      CatalogTableColumn((item: IAsset) => (
        <CatalogTableActions
          item={item}
          isRemoveAssetLoading={isRemoveAssetLoading}
          onRemove={() => handleRemoveAsset(item.asset_pricing.id)}
        />
      )),
    [],
  );

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-row justify-between gap-6">
        {(isBudgetCatalog ||
          (isDeviceCatalog && !!catalog?.total_requests)) && (
          <Card className="w-1/2">
            <CardHeader>
              <h3 className="font-medium text-sm">Employees requests</h3>
              <p className="font-semibold text-2xl text-black">
                {catalog?.total_requests
                  ? `${approvedReqs}/${catalog.total_requests}`
                  : "0"}
              </p>
            </CardHeader>

            <Separator />

            <CardContent className="grid place-content-end relative top-3">
              <Link
                href={{
                  pathname: routes.CATALOGS_EMPLOYEES_REQUEST,
                  query: { catalogId },
                }}
              >
                <Button
                  variant="ghost"
                  className="font-semibold text-sm text-primary-700 cursor-pointer"
                  data-testid="catalogtable-button"
                  disabled={isBudgetCatalog && !catalog?.total_requests}
                >
                  View requests
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {(isBudgetCatalog || (isDeviceCatalog && !!catalog?.total_amount)) && (
          <Card className="w-1/2">
            <CardHeader>
              <h3 className="font-medium text-sm">Price</h3>
              <p className="font-semibold text-2xl text-gray-900">
                {billingSymbol}
                {formatAmount(String(catalog?.total_amount ?? 0))}
              </p>
            </CardHeader>

            <Separator />

            <CardContent className="grid place-content-end relative top-3">
              <Link
                href={{
                  pathname: routes.CATALOGS_EMPLOYEES_REQUEST,
                  query: { catalogId },
                }}
              >
                <Button
                  variant="ghost"
                  className="font-semibold text-sm text-primary-700 cursor-pointer"
                  data-testid="catalogtable-button-2"
                  disabled={isBudgetCatalog && !catalog?.total_amount}
                >
                  Pay for orders
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {isDeviceCatalog && (
        <Card>
          <CardHeader className="p-2 border-b border-border-secondary flex flex-row items-center justify-between">
            <span className="text-gray-900 font-semibold text-lg">Items</span>
            <div className="grid place-content-center text-base font-semibold gap-x-2">
              <Link
                href={`${routes.CATALOGS_MARKETPLACE}/?catalogId=${catalogId}`}
              >
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center gap-x-2 text-sm font-semibold"
                  data-testid="catalogtable-button-3"
                >
                  <Plus />
                  Add items
                </Button>
              </Link>
            </div>
          </CardHeader>

          <PageState isError={isAssetsError} isLoading={isAssetsLoading}>
            <CardContent className="px-0 pt-0 pb-2">
              <DataTable
                data={assets}
                columns={columns}
                pagination={{
                  currentPage,
                  lastPage,
                  onPageChange: (value) => setPage(value),
                }}
              >
                <EmptyTableInstance
                  description="Please add items to your catalog"
                  title="No items yet"
                  onButtonClick={() =>
                    router.push(
                      `${routes.CATALOGS_MARKETPLACE}/?catalogId=${catalogId}`,
                    )
                  }
                  buttonText={
                    <span className="flex gap-x-1 items-center">
                      <Plus /> Add Items
                    </span>
                  }
                />
              </DataTable>
            </CardContent>
          </PageState>
        </Card>
      )}
    </div>
  );
};

export default CatalogTable;
