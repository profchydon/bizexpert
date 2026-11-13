"use client";

import { CheckCircle } from "@untitledui/icons";
import { RefundSummaryRows } from "@/components/application/refund/refund-summary";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import type { CancellationScope } from "@/utils/order-cancellation";
import type { RefundPreview } from "@/utils/refund-preview";
import { doneSummary } from "./buildCancelConsequence";

export function CancelDoneStep({
  isPreAccept,
  scope,
  preview,
  onClose,
}: {
  isPreAccept: boolean;
  scope: CancellationScope;
  preview: RefundPreview;
  onClose: () => void;
}) {
  const what = doneSummary(scope);

  return (
    <div className="flex w-full flex-col rounded-2xl bg-primary p-6 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <FeaturedIcon
          icon={CheckCircle}
          size="md"
          color="success"
          theme="light"
        />
        <CloseButton size="sm" onPress={onClose} />
      </div>
      <h3 className="mt-4 text-md font-semibold text-primary">
        {isPreAccept ? "Cancellation confirmed" : "Request sent"}
      </h3>
      <p className="mt-1 text-sm text-tertiary">
        {isPreAccept
          ? what
          : "A Rayda admin will review your cancellation request within 24 hours. You can withdraw it while it is pending."}
      </p>
      {isPreAccept && (
        <div className="mt-5 rounded-lg border border-secondary p-4">
          <RefundSummaryRows preview={preview} />
        </div>
      )}
      <div className="mt-6">
        <Button
          color="secondary"
          size="md"
          className="w-full"
          onClick={onClose}
          data-testid="canceldonestep-button"
        >
          Done
        </Button>
      </div>
    </div>
  );
}
