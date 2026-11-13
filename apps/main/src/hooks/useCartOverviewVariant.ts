"use client";

import { useSearchParams } from "next/navigation";
import {
  resolveCartOverviewVariant,
  type CartOverviewVariant,
} from "@/utils/cartOverviewInstance";

export function useCartOverviewVariant(): CartOverviewVariant {
  const searchParams = useSearchParams();
  return resolveCartOverviewVariant(searchParams);
}

export function useLegacyCartOverview(): boolean {
  return useCartOverviewVariant() === "legacy";
}
