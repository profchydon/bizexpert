"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApprovalRfqNoticeVariant } from "../approvalModalInteraction";

const noticeCopy: Record<
  ApprovalRfqNoticeVariant,
  { title: string; description: string }
> = {
  admin_response_pending: {
    title: "The RFQ raised needs to be responded to by Rayda Admin.",
    description: "View the RFQ details to track the pending vendor response.",
  },
  quote_ready: {
    title: "Rayda Admin has responded to this RFQ.",
    description: "View the RFQ details to review and accept the quote.",
  },
  quote_accepted: {
    title: "This RFQ has been accepted.",
    description: "View the RFQ details to review the accepted quote.",
  },
  quote_declined: {
    title: "This RFQ quote was rejected.",
    description: "View the RFQ details to review the rejected quote.",
  },
};

const noticeTheme: Record<
  ApprovalRfqNoticeVariant,
  { container: string; button: string }
> = {
  admin_response_pending: {
    container: "border-error-200 bg-error-50 text-error-700",
    button:
      "border-error-300 bg-white text-error-700 hover:bg-error-50 hover:text-error-800",
  },
  quote_ready: {
    container: "border-primary-200 bg-primary-50 text-primary-700",
    button:
      "border-primary-300 bg-white text-primary-700 hover:bg-primary-50 hover:text-primary-800",
  },
  quote_accepted: {
    container: "border-success-200 bg-success-50 text-success-700",
    button:
      "border-success-300 bg-white text-success-700 hover:bg-success-50 hover:text-success-800",
  },
  quote_declined: {
    container: "border-gray-200 bg-gray-50 text-gray-700",
    button:
      "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-800",
  },
};

export function ApprovalPendingRfqNotice({
  onViewDetails,
  variant,
}: {
  onViewDetails: () => void;
  variant: ApprovalRfqNoticeVariant;
}) {
  const copy = noticeCopy[variant];
  const theme = noticeTheme[variant];

  return (
    <>
      <div
        className={`mx-6 mt-3 flex flex-col gap-3 rounded-lg border px-4 py-2.5 md:mx-8 md:flex-row md:items-center md:justify-between ${theme.container}`}
      >
        <div className="flex min-w-0 gap-2.5">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium">{copy.title}</p>
            <p className="mt-0.5 text-sm">{copy.description}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={`h-8 w-fit shrink-0 px-3 text-sm font-medium md:ml-auto ${theme.button}`}
          onClick={onViewDetails}
          data-testid="approvalpendingrfqnotice-button"
        >
          View RFQ Details
        </Button>
      </div>
    </>
  );
}
