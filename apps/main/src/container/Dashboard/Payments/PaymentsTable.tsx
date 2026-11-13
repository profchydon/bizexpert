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
import { paymentColumns } from "./paymentColumns";
import { buildPaymentListMetrics } from "./paymentListMetrics";
import { PaymentsMetricCards } from "./PaymentsMetricCards";
import {
  PaymentsTableFilters,
  type PaymentsFilterState,
} from "./PaymentsTableFilters";
import {
  paymentsTableCountBadgeClass,
  paymentsTableHeaderClass,
  paymentsTableHeaderRowClass,
  paymentsTableShellClass,
  paymentsTableTitleClass,
} from "./paymentsPageClasses";
import { paymentsQueryKeys } from "./paymentsQueryKeys";

type Props = {
  onCreate: () => void;
};

const emptyFilters: PaymentsFilterState = { search: "", method: "" };

export function PaymentsTable({ onCreate }: Props) {
  const { businessId } = useBizExpertBusiness();
  const { push, isPending } = useTransitionRouter();
  const [filters, setFilters] = useState(emptyFilters);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: paymentsQueryKeys.list(businessId ?? ""),
    enabled: !!businessId,
    queryFn: async () => {
      const res = await bizexpertApi.get(`/businesses/${businessId}/payments`, {
        params: { limit: 100 },
      });
      return res.data as PaymentsListResponse;
    },
  });

  const rows = useMemo(() => {
    const list = (data?.data ?? []).filter((row) =>
      filters.method ? row.method === filters.method : true,
    );
    return filterPaymentsBySearch(list, filters.search);
  }, [data, filters.method, filters.search]);

  const metrics = useMemo(() => buildPaymentListMetrics(rows), [rows]);
  const count =
    filters.search || filters.method
      ? rows.length
      : (data?.total ?? rows.length);

  const columns = useMemo(
    () =>
      paymentColumns({
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
              Payments
              {!isLoading && count > 0 ? (
                <span className={paymentsTableCountBadgeClass}>{count}</span>
              ) : null}
            </h3>
            <PaymentsTableFilters filters={filters} onChange={setFilters} />
          </div>
        </div>
        <PageState isLoading={isLoading} isError={isError}>
          <DataTable
            data={rows}
            columns={columns}
            paginationClassName={referenceTablePaginationClass}
          >
            <EmptyTableInstance
              title="No payments yet"
              description="Record a payment against an unpaid sale."
              buttonText="Create payment"
              onButtonClick={onCreate}
            />
          </DataTable>
        </PageState>
      </div>
    </div>
  );
}
