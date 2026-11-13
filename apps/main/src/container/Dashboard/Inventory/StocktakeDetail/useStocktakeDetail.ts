"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bizexpertApi } from "@/lib/bizexpert/api";
import type { Stocktake } from "@/types/bizexpert";
import { readInventoryApiError } from "../inventoryApiError";
import { inventoryQueryKeys } from "../inventoryQueryKeys";

export function useStocktakeDetail(
  businessId: string | null,
  stocktakeId: string,
) {
  const qc = useQueryClient();
  const detailKey = inventoryQueryKeys.stocktake(businessId ?? "", stocktakeId);
  const base = `/businesses/${businessId}/stocktakes/${stocktakeId}`;

  const query = useQuery({
    queryKey: detailKey,
    enabled: !!businessId && !!stocktakeId,
    queryFn: async () => (await bizexpertApi.get(base)).data as Stocktake,
  });

  const invalidate = async () => {
    await qc.invalidateQueries({ queryKey: detailKey });
    await qc.invalidateQueries({ queryKey: ["inventory-balances"] });
    await qc.invalidateQueries({ queryKey: ["inventory-stocktakes"] });
  };

  const onError = (err: unknown) =>
    toast.error(readInventoryApiError(err, "Failed"));

  const saveCounts = useMutation({
    mutationFn: async (counts: Record<string, number>) => {
      const lines = Object.entries(counts).map(([lineId, countedQuantity]) => ({
        lineId,
        countedQuantity,
      }));
      if (!lines.length) return;
      await bizexpertApi.put(`${base}/counts`, { lines });
    },
    onSuccess: async () => {
      toast.success("Counts saved");
      await invalidate();
    },
    onError,
  });

  const submit = useMutation({
    mutationFn: async () => {
      await bizexpertApi.post(`${base}/submit`);
    },
    onSuccess: async () => {
      toast.success("Submitted for approval");
      await invalidate();
    },
    onError,
  });

  const approve = useMutation({
    mutationFn: async () => {
      await bizexpertApi.post(`${base}/approve`);
    },
    onSuccess: async () => {
      toast.success("Variances posted to inventory");
      await invalidate();
    },
    onError,
  });

  const reject = useMutation({
    mutationFn: async () => {
      await bizexpertApi.post(`${base}/reject`);
    },
    onSuccess: async () => {
      toast.success("Stocktake rejected");
      await invalidate();
    },
    onError,
  });

  return { query, saveCounts, submit, approve, reject };
}
