"use client";

import { Signal01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

// The doorway to the Discovered tab: awareness lives on the Equipment tab, the
// workflow lives in the queue.
export function DiscoveredBanner({
  count,
  onReview,
}: {
  count: number;
  onReview: () => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-100">
          <Signal01 className="size-5 text-brand-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-700">
            The telemetry agent found {count}{" "}
            {count === 1 ? "device" : "devices"} not in your Device Fleet
          </p>
          <p className="text-sm text-brand-600">
            Review them to add them to your fleet, or dismiss them.
          </p>
        </div>
      </div>
      <Button
        size="sm"
        onClick={onReview}
        data-testid="discoveredbanner-button"
      >
        Review devices
      </Button>
    </div>
  );
}
