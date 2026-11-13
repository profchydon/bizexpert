"use client";

import { InventoryOverviewTableCard } from "../Overview/InventoryOverviewTableCard";
import { customerAnalyticsColumns } from "./customerAnalyticsColumns";
import type { TopCustomerRow } from "./paymentsAnalyticsTypes";

type Props = {
  rows: TopCustomerRow[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export function CustomerAnalyticsTable({ rows, isLoading, isError }: Props) {
  const data = rows ?? [];
  return (
    <InventoryOverviewTableCard
      title="Top customers"
      count={data.length}
      isLoading={isLoading}
      isError={isError}
      rows={data}
      columns={customerAnalyticsColumns()}
      emptyTitle="No customer spend yet"
      emptyDescription="Completed sales with a customer in this period will rank here."
      getRowId={(row) => row.customerId}
    />
  );
}
