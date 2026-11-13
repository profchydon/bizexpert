"use client";

import { DataTable } from "@/components/ui/data-table";
import { referenceTablePaginationClass } from "@/components/application/table/reference-table-classes";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import PageState from "@/components/PageState";
import type { StockMovement } from "@/types/bizexpert";
import { trackItemHistoryColumns } from "./trackItemHistoryColumns";
import {
  trackItemTableCountBadgeClass,
  trackItemTableShellClass,
  trackItemTableTitleClass,
  trackItemTableToolbarClass,
} from "./trackItemPageClasses";

type Props = {
  rows: StockMovement[];
  isLoading: boolean;
  isError: boolean;
};

export function TrackItemHistoryTable({ rows, isLoading, isError }: Props) {
  return (
    <div className={trackItemTableShellClass}>
      <div className={trackItemTableToolbarClass}>
        <h3 className={trackItemTableTitleClass}>
          Movement history
          {!isLoading && rows.length > 0 ? (
            <span className={trackItemTableCountBadgeClass}>{rows.length}</span>
          ) : null}
        </h3>
      </div>
      <PageState isLoading={isLoading} isError={isError}>
        <DataTable
          data={rows}
          columns={trackItemHistoryColumns()}
          paginationClassName={referenceTablePaginationClass}
        >
          <EmptyTableInstance
            title="No movements yet"
            description="Receipts, sales, transfers, and adjustments for this product will show here."
          />
        </DataTable>
      </PageState>
    </div>
  );
}
