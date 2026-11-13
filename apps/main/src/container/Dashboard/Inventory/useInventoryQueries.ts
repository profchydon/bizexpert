"use client";

import { useQuery } from "@tanstack/react-query";
import { bizexpertApi } from "@/lib/bizexpert/api";
import type {
  InventoryBalance,
  Product,
  StockMovement,
  Stocktake,
  StockTransfer,
} from "@/types/bizexpert";
import { inventoryQueryKeys } from "./inventoryQueryKeys";
import type { InventoryTab } from "./inventoryTabs";

export function useInventoryQueries(
  businessId: string | null,
  locationId: string | null,
  tab: InventoryTab,
) {
  const balancesQuery = useQuery({
    queryKey: inventoryQueryKeys.balances(businessId ?? "", locationId),
    enabled: !!businessId && tab === "balances",
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/inventory/balances`,
        { params: locationId ? { locationId } : {} },
      );
      return res.data as InventoryBalance[];
    },
  });

  const productsQuery = useQuery({
    queryKey: inventoryQueryKeys.products(businessId ?? ""),
    enabled: !!businessId,
    queryFn: async () => {
      const res = await bizexpertApi.get(`/businesses/${businessId}/products`, {
        params: { limit: 100 },
      });
      return res.data.data as Product[];
    },
  });

  const movementsQuery = useQuery({
    queryKey: inventoryQueryKeys.movements(businessId ?? "", locationId),
    enabled: !!businessId && tab === "movements",
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/inventory/movements`,
        { params: { ...(locationId ? { locationId } : {}), limit: 50 } },
      );
      return res.data.data as StockMovement[];
    },
  });

  const transfersQuery = useQuery({
    queryKey: inventoryQueryKeys.transfers(businessId ?? ""),
    enabled: !!businessId && tab === "transfers",
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/inventory/transfers`,
      );
      return res.data as StockTransfer[];
    },
  });

  const stocktakesQuery = useQuery({
    queryKey: inventoryQueryKeys.stocktakes(businessId ?? "", locationId),
    enabled: !!businessId && tab === "stocktake",
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/stocktakes`,
        { params: locationId ? { locationId } : {} },
      );
      return res.data as Stocktake[];
    },
  });

  return {
    balancesQuery,
    productsQuery,
    movementsQuery,
    transfersQuery,
    stocktakesQuery,
  };
}
