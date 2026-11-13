"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { Sale, SalesListResponse } from "@/types/bizexpert";
import { filterSalesBySearch } from "./filterSalesBySearch";
import { buildSalesListMetrics } from "./saleListMetrics";
import { salesTableColumns } from "./saleColumns";
import { SalesMetricCards } from "./SalesMetricCards";
import {
  salesTableCountBadgeClass,
  salesTableHeaderClass,
  salesTableHeaderRowClass,
  salesTableShellClass,
  salesTableTitleClass,
} from "./salesPageClasses";
import { salesQueryKeys } from "./salesQueryKeys";
import { emptySalesFilters } from "./salesFiltersAreActive";
import { SalesTableFilters } from "./SalesTableFilters";
import { SalesTableActions } from "./tableActions";

type Props = {
  onCreate: () => void;
};

export function SalesTable({ onCreate }: Props) {
  const { businessId, locations } = useBizExpertBusiness();
  const { push, isPending } = useTransitionRouter();
  const [filters, setFilters] = useState(emptySalesFilters);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      ...salesQueryKeys.list(businessId ?? ""),
      filters.locationId,
      filters.status,
      filters.source,
      filters.startDate,
      filters.endDate,
    ],
    enabled: !!businessId,
    queryFn: async () => {
      const res = await bizexpertApi.get(`/businesses/${businessId}/sales`, {
        params: {
          limit: 100,
          locationId: filters.locationId || undefined,
          status: filters.status || undefined,
          source: filters.source || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        },
      });
      return res.data as SalesListResponse;
    },
  });

  const locationName = (locationId: string) =>
    locations.find((row) => row.id === locationId)?.name ?? "—";

  const rows = useMemo(
    () => filterSalesBySearch(data?.data ?? [], filters.search),
    [data, filters.search],
  );

  const metrics = useMemo(() => buildSalesListMetrics(rows), [rows]);
  const count = filters.search ? rows.length : (data?.total ?? rows.length);

  const columns = useMemo(
    () =>
      salesTableColumns({
        locationName,
        renderActions: (item: Sale) => (
          <SalesTableActions
            isNavigating={isPending && activeId === item.id}
            onView={() => {
              setActiveId(item.id);
              push(`/dashboard/sales/${item.id}`);
            }}
          />
        ),
      }),
    [activeId, isPending, locations, push],
  );

  return (
    <div className="flex flex-col gap-4">
      <SalesMetricCards metrics={metrics} />
      <div className={salesTableShellClass}>
        <div className={salesTableHeaderClass}>
          <div className={salesTableHeaderRowClass}>
            <h3 className={salesTableTitleClass}>
              Sales
              {!isLoading && count > 0 ? (
                <span className={salesTableCountBadgeClass}>{count}</span>
              ) : null}
            </h3>
          </div>
          <SalesTableFilters
            filters={filters}
            locations={locations}
            onChange={setFilters}
          />
        </div>
        <PageState isLoading={isLoading} isError={isError}>
          <DataTable
            data={rows}
            columns={columns}
            paginationClassName={referenceTablePaginationClass}
          >
            <EmptyTableInstance
              title="No sales yet"
              description="Record a sale to see receipts, payments, and invoices here."
              buttonText="Record sale"
              onButtonClick={onCreate}
            />
          </DataTable>
        </PageState>
      </div>
    </div>
  );
}
