"use client";

import { useMemo } from "react";
import { InventoryOverviewTableCard } from "./InventoryOverviewTableCard";
import { inventoryLowStockColumns } from "./inventoryLowStockColumns";
import type { InventoryLowStockRow } from "./inventoryOverviewTypes";

type Props = {
  rows: InventoryLowStockRow[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export function InventoryLowStockTable({ rows, isLoading, isError }: Props) {
  const columns = useMemo(() => inventoryLowStockColumns(), []);
  const data = rows ?? [];

  return (
    <InventoryOverviewTableCard
      title="Low stock"
      count={!isLoading ? data.length : undefined}
      isLoading={isLoading}
      isError={isError}
      rows={data}
      columns={columns}
      emptyTitle="Inventory looks healthy"
      emptyDescription="No products are at or below their low-stock threshold."
      getRowId={(row) => `${row.productId}-${row.locationId}`}
    />
  );
}
