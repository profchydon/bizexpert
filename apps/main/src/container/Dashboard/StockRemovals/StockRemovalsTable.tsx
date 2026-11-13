"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import PageState from "@/components/PageState";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type { StockMovement } from "@/types/bizexpert";
import { filterStockRemovalsBySearch } from "./filterStockRemovalsBySearch";
import { stockRemovalColumns } from "./stockRemovalColumns";
import {
  stockRemovalsTableCountBadgeClass,
  stockRemovalsTableShellClass,
  stockRemovalsTableTitleClass,
  stockRemovalsTableToolbarClass,
} from "./stockRemovalsPageClasses";
import { stockRemovalsQueryKeys } from "./stockRemovalsQueryKeys";
import {
  StockRemovalsTableFilters,
  type StockRemovalsFilterState,
} from "./StockRemovalsTableFilters";

type Props = {
  onCreate: () => void;
};

const emptyFilters: StockRemovalsFilterState = {
  search: "",
  locationId: "",
  startDate: "",
  endDate: "",
};

export function StockRemovalsTable({ onCreate }: Props) {
  const { businessId, locations } = useBizExpertBusiness();
  const [filters, setFilters] =
    useState<StockRemovalsFilterState>(emptyFilters);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      ...stockRemovalsQueryKeys.list(businessId ?? ""),
      filters.locationId,
      filters.startDate,
      filters.endDate,
    ],
    enabled: !!businessId,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/inventory/movements`,
        {
          params: {
            type: "damage",
            limit: 100,
            locationId: filters.locationId || undefined,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
          },
        },
      );
      return res.data.data as StockMovement[];
    },
  });

  const locationName = (locationId: string | undefined) =>
    locations.find((row) => row.id === locationId)?.name ?? "—";

  const rows = useMemo(
    () => filterStockRemovalsBySearch(data ?? [], filters.search),
    [data, filters.search],
  );

  const columns = useMemo(
    () => stockRemovalColumns({ locationName }),
    [locations],
  );

  return (
    <div className={stockRemovalsTableShellClass}>
      <div className={stockRemovalsTableToolbarClass}>
        <h3 className={stockRemovalsTableTitleClass}>
          Stock removals
          {!isLoading && rows.length > 0 ? (
            <span className={stockRemovalsTableCountBadgeClass}>
              {rows.length}
            </span>
          ) : null}
        </h3>
        <StockRemovalsTableFilters
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
            title="No stock removals yet"
            description="Remove damaged, expired, or excess stock to keep balances accurate."
            buttonText="Remove stock"
            onButtonClick={onCreate}
          />
        </DataTable>
      </PageState>
    </div>
  );
}
