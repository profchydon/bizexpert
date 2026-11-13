"use client";

import { Button } from "@/components/ui/button";

import type { RulePagination } from "../../types";
import { getPaginationControls } from "../../utilsPagination";

export function ConfigureRuleDrawerPagination({
  pagination,
}: {
  pagination?: RulePagination;
}) {
  if (!pagination || pagination.lastPage <= 1) return null;
  const { canGoNext, canGoPrevious } = getPaginationControls(pagination);

  return (
    <div className="flex items-center gap-3 text-sm text-gray-500">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 rounded-lg bg-white px-3 text-sm font-semibold"
        disabled={!canGoPrevious}
        onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
        data-testid="configureruledrawerpagination-button"
      >
        Previous
      </Button>
      <span className="whitespace-nowrap">
        Page {pagination.currentPage} of {pagination.lastPage}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 rounded-lg bg-white px-3 text-sm font-semibold"
        disabled={!canGoNext}
        onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
        data-testid="configureruledrawerpagination-button-2"
      >
        Next
      </Button>
    </div>
  );
}
