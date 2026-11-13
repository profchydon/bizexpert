"use client";

import type { ReactNode } from "react";
import { Cloud } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { IconButton } from "./PrimaryButton";

export interface MarketplaceEmptyStateProps {
  onClearFilters: () => void;
  onOpenCustomRequest: () => void;
  emptyStateImageSlot?: ReactNode;
  rfqButtonLabel?: string;
}

export const MarketplaceEmptyState = ({
  onClearFilters,
  onOpenCustomRequest,
  emptyStateImageSlot,
  rfqButtonLabel = "RFQ Request",
}: MarketplaceEmptyStateProps) => (
  <div className="mp-grid mp-w-full mp-place-content-center mp-py-12">
    {emptyStateImageSlot ?? (
      <div className="mp-mx-auto mp-flex mp-h-24 mp-w-24 mp-items-center mp-justify-center mp-rounded-full mp-bg-gray-100">
        <Cloud className="mp-h-10 mp-w-10 mp-text-gray-400" />
      </div>
    )}

    <div className="mp-mt-5 mp-flex mp-flex-col mp-text-center">
      <h5 className="mp-text-lg mp-font-semibold mp-text-gray-900">
        No devices found
      </h5>
      <p className="mp-mt-2 mp-text-sm mp-text-gray-600">
        Try a different search term or adjust your filters.
      </p>

      <div className="mp-mx-auto mp-mt-8 mp-flex mp-flex-row mp-gap-3">
        <IconButton
          className="mp-h-11 mp-rounded-lg mp-px-4 mp-text-sm mp-font-semibold"
          onClick={onClearFilters}
          data-testid="marketplace-empty-clear-button"
        >
          Clear search
        </IconButton>
        <PrimaryButton
          size="lg"
          onClick={onOpenCustomRequest}
          data-testid="marketplace-empty-rfq-button"
        >
          {rfqButtonLabel}
        </PrimaryButton>
      </div>
    </div>
  </div>
);
