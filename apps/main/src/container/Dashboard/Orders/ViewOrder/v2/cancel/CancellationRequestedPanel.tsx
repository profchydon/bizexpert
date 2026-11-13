"use client";

import { Clock } from "@untitledui/icons";
import { Banner } from "@/components/application/alerts/banner";
import { Button } from "@/components/base/buttons/button";
import {
  type CancellationInfo,
  reasonLabel,
  scopeLabel,
  scopeSubject,
} from "@/utils/order-cancellation";

interface Props {
  info: CancellationInfo;
  totals: { subOrders: number; items: number };
  onWithdraw: () => void;
}

export function CancellationRequestedPanel({
  info,
  totals,
  onWithdraw,
}: Props) {
  return (
    <Banner
      tone="warning"
      icon={Clock}
      title="Cancellation requested, pending review"
      description={
        <>
          You asked to cancel {scopeSubject(info.scope)}. A Rayda admin will
          review the request within 24 hours.
          {info.scope.kind === "full"
            ? ""
            : " The rest of the order carries on meanwhile."}
        </>
      }
      meta={
        <>
          Scope: {scopeLabel(info.scope, totals)}. Reason:{" "}
          {reasonLabel(info.reasonId)}.{info.details ? ` ${info.details}` : ""}
        </>
      }
      action={
        <Button
          color="secondary"
          size="md"
          onClick={onWithdraw}
          data-testid="cancellationrequestedpanel-button"
        >
          Withdraw request
        </Button>
      }
    />
  );
}
