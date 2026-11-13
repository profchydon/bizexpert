"use client";

import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import PageState from "@/components/PageState";
import type { InventoryBalance } from "@/types/bizexpert";
import { trackItemStockColumns } from "./trackItemStockColumns";
import {
  trackItemTableCountBadgeClass,
  trackItemTableShellClass,
  trackItemTableTitleClass,
  trackItemTableToolbarClass,
} from "./trackItemPageClasses";

type Props = {
  rows: InventoryBalance[];
  isLoading: boolean;
  isError: boolean;
};

export function TrackItemStockTable({ rows, isLoading, isError }: Props) {
  return (
    <div className={trackItemTableShellClass}>
      <div className={trackItemTableToolbarClass}>
        <h3 className={trackItemTableTitleClass}>
          Stock by store
          {!isLoading && rows.length > 0 ? (
            <span className={trackItemTableCountBadgeClass}>{rows.length}</span>
          ) : null}
        </h3>
      </div>
      <PageState isLoading={isLoading} isError={isError}>
        <DataTable
          data={rows}
          columns={trackItemStockColumns()}
          paginationClassName={referenceTablePaginationClass}
        >
          <EmptyTableInstance
            title="No stock at any store"
            description="Receive or transfer this product to see balances by store."
          />
        </DataTable>
      </PageState>
    </div>
  );
}
