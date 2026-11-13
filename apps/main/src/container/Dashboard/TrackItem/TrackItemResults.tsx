"use client";

import { useQuery } from "@tanstack/react-query";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import type {
  InventoryBalance,
  Product,
  StockMovement,
} from "@/types/bizexpert";
import { TrackItemHistoryTable } from "./TrackItemHistoryTable";
import { TrackItemStockTable } from "./TrackItemStockTable";
import { TrackItemSummary } from "./TrackItemSummary";
import { filterBalancesForProduct } from "./trackItemLookup";
import { trackItemQueryKeys } from "./trackItemQueryKeys";

type Props = {
  product: Product;
};

export function TrackItemResults({ product }: Props) {
  const { businessId } = useBizExpertBusiness();

  const balancesQuery = useQuery({
    queryKey: trackItemQueryKeys.balances(businessId ?? "", product.id),
    enabled: !!businessId,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/inventory/balances`,
      );
      return res.data as InventoryBalance[];
    },
  });

  const movementsQuery = useQuery({
    queryKey: trackItemQueryKeys.movements(businessId ?? "", product.id),
    enabled: !!businessId,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/inventory/movements`,
        { params: { productId: product.id, limit: 100 } },
      );
      return res.data.data as StockMovement[];
    },
  });

  const stock = filterBalancesForProduct(balancesQuery.data ?? [], product.id);

  return (
    <>
      <TrackItemSummary product={product} stock={stock} />
      <TrackItemStockTable
        rows={stock}
        isLoading={balancesQuery.isLoading}
        isError={balancesQuery.isError}
      />
      <TrackItemHistoryTable
        rows={movementsQuery.data ?? []}
        isLoading={movementsQuery.isLoading}
        isError={movementsQuery.isError}
      />
    </>
  );
}
