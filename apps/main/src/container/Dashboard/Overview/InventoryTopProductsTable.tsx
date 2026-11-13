"use client";

import { useMemo } from "react";
import { InventoryOverviewTableCard } from "./InventoryOverviewTableCard";
import { inventoryTopProductColumns } from "./inventoryTopProductColumns";
import type { InventoryTopProductRow } from "./inventoryOverviewTypes";

type Props = {
  rows: InventoryTopProductRow[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export function InventoryTopProductsTable({ rows, isLoading, isError }: Props) {
  const columns = useMemo(() => inventoryTopProductColumns(), []);
  const data = rows ?? [];

  return (
    <InventoryOverviewTableCard
      title="Top products"
      count={!isLoading ? data.length : undefined}
      isLoading={isLoading}
      isError={isError}
      rows={data}
      columns={columns}
      emptyTitle="No product sales"
      emptyDescription="Completed sales in the last 30 days will rank here by revenue."
      getRowId={(row) => row.productId}
    />
  );
}
