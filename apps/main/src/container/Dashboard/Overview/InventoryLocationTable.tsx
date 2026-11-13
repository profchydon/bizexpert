"use client";

import { useMemo } from "react";
import { InventoryOverviewTableCard } from "./InventoryOverviewTableCard";
import { inventoryLocationColumns } from "./inventoryLocationColumns";
import type { InventoryLocationRow } from "./inventoryOverviewTypes";

type Props = {
  rows: InventoryLocationRow[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export function InventoryLocationTable({ rows, isLoading, isError }: Props) {
  const columns = useMemo(() => inventoryLocationColumns(), []);
  const data = rows ?? [];

  return (
    <InventoryOverviewTableCard
      title="Store performance"
      count={!isLoading ? data.length : undefined}
      isLoading={isLoading}
      isError={isError}
      rows={data}
      columns={columns}
      emptyTitle="No store sales"
      emptyDescription="Completed sales in the last 30 days will show revenue by store."
      getRowId={(row) => row.locationId}
    />
  );
}
