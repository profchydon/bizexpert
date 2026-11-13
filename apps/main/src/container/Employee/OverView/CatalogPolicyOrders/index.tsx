import EmptyTableInstance from "@/components/EmptyTableInstance";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useGetEmployeeCatalogPolicyOrderRequestsQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployeeCatalogPolicyOrderRequests";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useEffect, useMemo, useState } from "react";
import CatalogPolicyOrderColumns from "./columns";
import {
  catalogPolicyOrdersToRows,
  getCatalogPolicyOrderRejectionReason,
  type EmployeeCatalogPolicyOrderRow,
} from "./utils";
import type { IEmployeeCatalogPolicy } from "@/types/employees";

const pageSize = 20;

const CatalogPolicyOrders = ({
  catalogPolicies,
  description = "View your orders here",
  title = "Orders",
}: {
  catalogPolicies: IEmployeeCatalogPolicy[];
  description?: string;
  title?: string;
}) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const [page, setPage] = useState(1);
  const [rejectedOrder, setRejectedOrder] =
    useState<EmployeeCatalogPolicyOrderRow | null>(null);
  const [activeCatalogId, setActiveCatalogId] = useState(
    catalogPolicies[0]?.id ?? "",
  );
  const activeCatalogPolicy =
    catalogPolicies.find((catalog) => catalog.id === activeCatalogId) ??
    catalogPolicies[0];
  const { data: requestsRes, isFetching } =
    useGetEmployeeCatalogPolicyOrderRequestsQuery(
      {
        catalogId: activeCatalogPolicy?.id!,
        companyId: company?.id!,
        params: { page, per_page: pageSize },
      },
      { skip: !company?.id || !activeCatalogPolicy?.id },
    );

  useEffect(() => {
    if (!catalogPolicies.length) return;
    if (!catalogPolicies.some((catalog) => catalog.id === activeCatalogId)) {
      setActiveCatalogId(catalogPolicies[0].id);
      setPage(1);
    }
  }, [activeCatalogId, catalogPolicies]);

  const payload = requestsRes?.data;
  const rows = useMemo(
    () =>
      catalogPolicyOrdersToRows({
        catalogPolicy: activeCatalogPolicy,
        payload,
      }),
    [activeCatalogPolicy, payload],
  );
  const columns = useMemo(
    () =>
      CatalogPolicyOrderColumns({
        onViewRejectionReason: setRejectedOrder,
      }),
    [],
  );
  const lastPage = Array.isArray(payload) ? 1 : (payload?.last_page ?? 1);
  const currentPage = Array.isArray(payload)
    ? page
    : (payload?.current_page ?? page);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg text-gray-900 font-semibold">{title}</h2>
          <span className="text-sm">{description}</span>
        </div>
      </div>

      {catalogPolicies.length > 1 ? (
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {catalogPolicies.map((catalogPolicy) => (
            <button
              key={catalogPolicy.id}
              type="button"
              className={cn(
                "min-w-max rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600",
                activeCatalogPolicy?.id === catalogPolicy.id &&
                  "bg-primary-50 text-primary-700",
              )}
              onClick={() => {
                setActiveCatalogId(catalogPolicy.id);
                setPage(1);
              }}
            >
              {catalogPolicy.name}
            </button>
          ))}
        </div>
      ) : null}

      {isFetching && !rows.length ? (
        <div className="rounded-xl border border-gray-200 p-10 text-center text-sm text-gray-500">
          Loading orders...
        </div>
      ) : (
        <DataTable
          data={rows}
          columns={[...columns]}
          pagination={{
            currentPage,
            lastPage,
            onPageChange: setPage,
            nextLabel: "Next",
            prevLabel: "Previous",
          }}
        >
          <EmptyTableInstance
            title="No orders yet"
            description="You have no catalog policy orders yet"
          />
        </DataTable>
      )}

      <Dialog
        open={Boolean(rejectedOrder)}
        onOpenChange={(open) => {
          if (!open) setRejectedOrder(null);
        }}
        data-testid="catalogpolicyorders-dialog"
      >
        <DialogContent className="max-w-md">
          <DialogTitle>Reason for rejection</DialogTitle>
          <DialogDescription>
            {rejectedOrder?.catalogPolicyName ?? "Catalog policy order request"}
          </DialogDescription>
          <div className="rounded-lg border border-error-200 bg-error-50 p-4">
            <p className="text-sm font-normal text-error-700">
              {rejectedOrder
                ? getCatalogPolicyOrderRejectionReason(rejectedOrder)
                : "-"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CatalogPolicyOrders;
