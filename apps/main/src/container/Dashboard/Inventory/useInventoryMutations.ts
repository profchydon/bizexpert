"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bizexpertApi } from "@/lib/bizexpert/api";
import type { Stocktake } from "@/types/bizexpert";
import { readInventoryApiError } from "./inventoryApiError";
import type {
  AdjustFormValues,
  StockFormValues,
  TransferFormValues,
} from "./inventoryPayloads";
import {
  toAdjustPayload,
  toOpeningPayload,
  toReceivePayload,
  toTransferPayload,
} from "./inventoryPayloads";

export function useInventoryMutations(
  businessId: string | null,
  locationId: string | undefined,
) {
  const qc = useQueryClient();
  const base = `/businesses/${businessId}/inventory`;

  const invalidateStock = async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["inventory-balances"] }),
      qc.invalidateQueries({ queryKey: ["inventory-movements"] }),
      qc.invalidateQueries({ queryKey: ["inventory-transfers"] }),
    ]);
  };

  const onError = (err: unknown) =>
    toast.error(readInventoryApiError(err, "Failed"));

  const opening = useMutation({
    mutationFn: async (values: StockFormValues) => {
      if (!locationId) throw new Error("Pick a location");
      await bizexpertApi.post(
        `${base}/opening-stock`,
        toOpeningPayload(locationId, values),
      );
    },
    onSuccess: async () => {
      toast.success("Opening stock set");
      await invalidateStock();
    },
    onError,
  });

  const receive = useMutation({
    mutationFn: async (values: StockFormValues) => {
      if (!locationId) throw new Error("Pick a location");
      await bizexpertApi.post(
        `${base}/receive`,
        toReceivePayload(locationId, values),
      );
    },
    onSuccess: async () => {
      toast.success("Stock received");
      await invalidateStock();
    },
    onError,
  });

  const adjust = useMutation({
    mutationFn: async (values: AdjustFormValues) => {
      if (!locationId) throw new Error("Pick a location");
      await bizexpertApi.post(
        `${base}/adjust`,
        toAdjustPayload(locationId, values),
      );
    },
    onSuccess: async () => {
      toast.success("Stock adjusted");
      await invalidateStock();
    },
    onError,
  });

  const transfer = useMutation({
    mutationFn: async (values: TransferFormValues) => {
      await bizexpertApi.post(`${base}/transfer`, toTransferPayload(values));
    },
    onSuccess: async () => {
      toast.success("Transfer dispatched");
      await invalidateStock();
    },
    onError,
  });

  const receiveTransfer = useMutation({
    mutationFn: async (transferId: string) => {
      await bizexpertApi.post(`${base}/transfers/${transferId}/receive`, {});
    },
    onSuccess: async () => {
      toast.success("Transfer received");
      await invalidateStock();
    },
    onError,
  });

  const cancelTransfer = useMutation({
    mutationFn: async (transferId: string) => {
      await bizexpertApi.post(`${base}/transfers/${transferId}/cancel`);
    },
    onSuccess: async () => {
      toast.success("Transfer cancelled");
      await invalidateStock();
    },
    onError,
  });

  const startStocktake = useMutation({
    mutationFn: async () => {
      if (!locationId) throw new Error("Pick a location");
      const res = await bizexpertApi.post(
        `/businesses/${businessId}/stocktakes`,
        { locationId },
      );
      return res.data as Stocktake;
    },
    onSuccess: async () => {
      toast.success("Stock count started");
      await qc.invalidateQueries({ queryKey: ["inventory-stocktakes"] });
    },
    onError,
  });

  return {
    opening,
    receive,
    adjust,
    transfer,
    receiveTransfer,
    cancelTransfer,
    startStocktake,
  };
}
