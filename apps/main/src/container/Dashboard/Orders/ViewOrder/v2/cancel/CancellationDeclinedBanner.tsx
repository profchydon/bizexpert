"use client";

import { InfoCircle } from "@untitledui/icons";
import { Banner } from "@/components/application/alerts/banner";
import type { CancellationInfo } from "@/utils/order-cancellation";

export function CancellationDeclinedBanner({
  info,
}: {
  info: CancellationInfo;
}) {
  return (
    <Banner
      tone="info"
      icon={InfoCircle}
      title="Cancellation request declined"
      description="Your order continues and the original delivery date stands."
      meta={
        info.declineReason
          ? `Reason from admin: ${info.declineReason}`
          : undefined
      }
    />
  );
}
