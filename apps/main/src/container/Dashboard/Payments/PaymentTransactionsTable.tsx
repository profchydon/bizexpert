"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { bizexpertApi } from "@/lib/bizexpert/api";
import routes from "@/routes";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { PaymentListItem, PaymentsListResponse } from "@/types/bizexpert";
import { SalesTableActions } from "../Sales/tableActions";
import { filterPaymentsBySearch } from "./filterPaymentsBySearch";
import { paymentTransactionColumns } from "./paymentTransactionColumns";
import {
  emptyPaymentTransactionFilters,
  paymentTransactionHasLocalFilter,
  paymentTransactionParams,
} from "./paymentTransactionFilters";
import { buildPaymentTransactionMetrics } from "./paymentTransactionMetrics";
import { PaymentTransactionsFilters } from "./PaymentTransactionsFilters";
import { PaymentsMetricCards } from "./PaymentsMetricCards";
import {
  paymentsTableCountBadgeClass,
  paymentsTableHeaderClass,
  paymentsTableHeaderRowClass,
  paymentsTableShellClass,
  paymentsTableTitleClass,
} from "./paymentsPageClasses";
import { paymentsQueryKeys } from "./paymentsQueryKeys";

export function PaymentTransactionsTable() {
  const { businessId, locations } = useBizExpertBusiness();
  const { push, isPending } = useTransitionRouter();
  const [filters, setFilters] = useState(emptyPaymentTransactionFilters);
  const [activeId, setActiveId] = useState<string | null>(null);

  const query = {
    method: filters.method,
    locationId: filters.locationId,
    startDate: filters.startDate,
    endDate: filters.endDate,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: paymentsQueryKeys.transactions(businessId ?? "", query),
    enabled: !!businessId,
    queryFn: async () => {
      const res = await bizexpertApi.get(`/businesses/${businessId}/payments`, {
        params: paymentTransactionParams(filters),
      });
      return res.data as PaymentsListResponse;
    },
  });

  const rows = useMemo(
    () => filterPaymentsBySearch(data?.data ?? [], filters.search),
    [data, filters.search],
  );

  const metrics = useMemo(() => buildPaymentTransactionMetrics(rows), [rows]);
  const count = paymentTransactionHasLocalFilter(filters)
    ? rows.length
    : (data?.total ?? rows.length);

  const columns = useMemo(
    () =>
      paymentTransactionColumns({
        renderActions: (item: PaymentListItem) => (
          <SalesTableActions
            isNavigating={isPending && activeId === item.id}
            onView={() => {
              setActiveId(item.id);
              push(`${routes.SALES}/${item.saleId}`);
            }}
          />
        ),
      }),
    [activeId, isPending, push],
  );

  return (
    <div className="flex flex-col gap-4">
      <PaymentsMetricCards metrics={metrics} />
      <div className={paymentsTableShellClass}>
        <div className={paymentsTableHeaderClass}>
          <div className={paymentsTableHeaderRowClass}>
            <h3 className={paymentsTableTitleClass}>
              Transactions
              {!isLoading && count > 0 ? (
                <span className={paymentsTableCountBadgeClass}>{count}</span>
              ) : null}
            </h3>
            <PaymentTransactionsFilters
              filters={filters}
              locations={locations}
              onChange={setFilters}
            />
          </div>
        </div>
        <PageState isLoading={isLoading} isError={isError}>
          <DataTable
            data={rows}
            columns={columns}
            paginationClassName={referenceTablePaginationClass}
          >
            <EmptyTableInstance
              title="No inflow transactions"
              description="Credits appear here when you record a payment on a sale."
            />
          </DataTable>
        </PageState>
      </div>
    </div>
  );
}
