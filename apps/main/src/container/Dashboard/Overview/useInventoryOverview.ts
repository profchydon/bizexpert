"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { bizexpertApi } from "@/lib/bizexpert/api";
import { useBizExpertBusiness } from "@/store/bizexpert/business-context";
import {
  INVENTORY_OVERVIEW_TOP_LIMIT,
  inventoryOverviewStartDate,
} from "./inventoryOverviewRange";
import type {
  CollectionSummary,
  InventoryChartPoint,
  InventoryLocationRow,
  InventoryLowStockRow,
  InventoryTopProductRow,
  InventoryValuationSummary,
  SalesSummary,
} from "./inventoryOverviewTypes";

export function useInventoryOverview() {
  const { businessId, locationId } = useBizExpertBusiness();
  const startDate = useMemo(() => inventoryOverviewStartDate(), []);
  const scoped = locationId ? { locationId } : {};
  const range = { ...scoped, startDate };
  const enabled = Boolean(businessId);

  const summary = useQuery({
    queryKey: ["sales-summary", businessId, locationId, startDate],
    enabled,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/analytics/sales-summary`,
        { params: range },
      );
      return res.data as SalesSummary;
    },
  });

  const collections = useQuery({
    queryKey: ["collection-summary", businessId, locationId, startDate],
    enabled,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/analytics/collection-summary`,
        { params: range },
      );
      return res.data as CollectionSummary;
    },
  });

  const chart = useQuery({
    queryKey: ["sales-by-period", businessId, locationId, startDate],
    enabled,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/analytics/sales-by-period`,
        { params: { ...range, groupBy: "day" } },
      );
      return res.data as InventoryChartPoint[];
    },
  });

  const lowStock = useQuery({
    queryKey: ["low-stock", businessId, locationId],
    enabled,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/analytics/low-stock`,
        { params: scoped },
      );
      return res.data as InventoryLowStockRow[];
    },
  });

  const topProducts = useQuery({
    queryKey: ["top-products", businessId, locationId, startDate],
    enabled,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/analytics/top-products`,
        { params: { ...range, limit: INVENTORY_OVERVIEW_TOP_LIMIT } },
      );
      return res.data as InventoryTopProductRow[];
    },
  });

  const locations = useQuery({
    queryKey: ["location-comparison", businessId, startDate],
    enabled,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/analytics/locations`,
        { params: { startDate } },
      );
      return res.data as InventoryLocationRow[];
    },
  });

  const valuation = useQuery({
    queryKey: ["inventory-valuation", businessId, locationId],
    enabled,
    queryFn: async () => {
      const res = await bizexpertApi.get(
        `/businesses/${businessId}/analytics/inventory-valuation`,
        { params: scoped },
      );
      return res.data as InventoryValuationSummary;
    },
  });

  return {
    businessId,
    summary,
    collections,
    chart,
    lowStock,
    topProducts,
    locations,
    valuation,
  };
}
