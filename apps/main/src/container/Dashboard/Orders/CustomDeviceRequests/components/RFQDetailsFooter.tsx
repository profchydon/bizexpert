"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { cn } from "@/lib/utils";
import type { CustomDeviceRequest } from "../types";
import { rfqCreateRequestHref } from "../rfqCreateRequestHref";
import { storeRfqCreateRequestPrefillFromRequest } from "../rfqCreateRequestPrefill";
import { approvalRequestHrefForRfq } from "./rfqDecisionState";

interface RFQDetailsFooterProps {
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirmOrder: () => void;
  onRejectQuote: () => void;
  request: CustomDeviceRequest;
  showApprovalRequestRedirect?: boolean;
}

export function RFQDetailsFooter({
  isSubmitting = false,
  onClose,
  onConfirmOrder,
  onRejectQuote,
  request,
  showApprovalRequestRedirect = true,
}: Readonly<RFQDetailsFooterProps>) {
  const { push, isPending } = useTransitionRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnHref = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);
  const approvalRequestHref = approvalRequestHrefForRfq(
    request,
    showApprovalRequestRedirect,
  );

  return (
    <div className="fixed bottom-0 left-0 z-[201] w-full border-t border-gray-200 bg-white px-6 py-4">
      {approvalRequestHref ? (
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 rounded-lg border border-primary-100 bg-primary-50 p-3 text-primary-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="text-sm leading-5">
              This quote is linked to a catalog approval request. Open the
              approval request to accept or reject the quote.
            </p>
          </div>
          <Link
            href={approvalRequestHref}
            className={cn(buttonVariants({ className: "w-full" }))}
            data-testid="rfqdetailsfooter-button"
          >
            View Approval Request
          </Link>
        </div>
      ) : request.status === "expired" ? (
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="text-sm leading-5">
              This quote has expired. Submit a new request if you still need
              these items.
            </p>
          </div>
          <Button
            className="w-full"
            disabled={isPending}
            onClick={() => {
              storeRfqCreateRequestPrefillFromRequest(request, returnHref);
              push(rfqCreateRequestHref(request));
            }}
            data-testid="rfqdetailsfooter-button"
          >
            {isPending ? "Opening..." : "Submit New Request"}
          </Button>
        </div>
      ) : request.status === "waiting_for_action" ? (
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            disabled={isSubmitting}
            onClick={onRejectQuote}
            data-testid="rfqdetailsfooter-button-2"
          >
            Reject Quote
          </Button>
          <Button
            className="flex-1"
            disabled={isSubmitting}
            onClick={onConfirmOrder}
            data-testid="rfqdetailsfooter-button-3"
          >
            Confirm Order
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          disabled={isSubmitting}
          onClick={onClose}
          data-testid="rfqdetailsfooter-button-4"
        >
          Close
        </Button>
      )}
    </div>
  );
}
