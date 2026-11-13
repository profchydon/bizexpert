"use client";

import type { Dispatch, SetStateAction } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ruleToPolicyPayload } from "./apiAdapters";
import {
  removeSelectionLimitsReviewParam,
  REVIEW_SELECTION_LIMITS_PARAM,
} from "./selectionLimitReviewStorage";
import type { CatalogRule, SelectionLimit } from "./types";
import type { useCatalogRuleDetailOverlays } from "./useCatalogRuleDetailOverlays";

interface UseSelectionLimitActionsArgs {
  onDismissSelectionLimitsReview?: () => void;
  overlays: ReturnType<typeof useCatalogRuleDetailOverlays>;
  rule?: CatalogRule;
  savePolicy: (updates: CatalogRule) => Promise<void>;
  selectionLimits: SelectionLimit[];
  setSelectionLimits: Dispatch<SetStateAction<SelectionLimit[]>>;
}

export function useSelectionLimitActions({
  onDismissSelectionLimitsReview,
  overlays,
  rule,
  savePolicy,
  selectionLimits,
  setSelectionLimits,
}: UseSelectionLimitActionsArgs) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function dismissSelectionLimitsReview() {
    onDismissSelectionLimitsReview?.();
    if (!searchParams.has(REVIEW_SELECTION_LIMITS_PARAM)) return;

    router.replace(
      removeSelectionLimitsReviewParam(pathname, searchParams.toString()),
      { scroll: false },
    );
  }

  return {
    openSelectionLimitsDrawer: () => {
      dismissSelectionLimitsReview();
      setSelectionLimits(rule?.selectionLimits ?? []);
      overlays.setters.setLimitsOpen(false);
      overlays.setters.setLimitsDrawerOpen(true);
    },
    saveSelectionLimits: async (next = selectionLimits) => {
      if (!rule) return;
      dismissSelectionLimitsReview();
      const nextRule = { ...rule, selectionLimits: next };
      await savePolicy(nextRule);
      setSelectionLimits(next);
      overlays.setters.setLimitsOpen(false);
      overlays.setters.setLimitsDrawerOpen(false);
    },
  };
}
