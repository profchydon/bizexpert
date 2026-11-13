"use client";

import { Button } from "@/components/base/buttons/button";

interface Props {
  count: number;
  onReview: () => void;
}

export function StorageCheckoutBar({ count, onReview }: Props) {
  if (count === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-25 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-brand-800">
          {count} storage {count === 1 ? "request" : "requests"} queued
        </p>
        <p className="text-sm text-brand-700">
          Review your cart and submit when ready.
        </p>
      </div>
      <Button
        size="sm"
        onClick={onReview}
        data-testid="storagecheckoutbar-button"
      >
        Review requests
      </Button>
    </div>
  );
}
