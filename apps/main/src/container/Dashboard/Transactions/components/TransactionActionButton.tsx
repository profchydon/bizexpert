"use client";

import { useState } from "react";
import { ArrowRight, RefreshCw01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { useScopedViewNavigation } from "@/hooks/useViewNavigation";
import { getTransactionListAction } from "../transactionActionMeta";

interface Props {
  status?: string;
  viewHref: string;
  viewKey?: string;
  paymentLink?: string | null;
  fullWidth?: boolean;
  dataTestId?: string;
}

const TransactionActionButton = ({
  status,
  viewHref,
  viewKey,
  paymentLink,
  fullWidth,
  dataTestId,
}: Props) => {
  const { view, isViewLoading } = useScopedViewNavigation();
  const [isRetrying, setIsRetrying] = useState(false);
  const action = getTransactionListAction(status);
  const loadingKey = viewKey || viewHref;
  const className = fullWidth ? "w-full" : undefined;

  if (action === "retry") {
    return (
      <Button
        size={fullWidth ? "md" : "sm"}
        color="primary"
        iconLeading={RefreshCw01}
        isLoading={isRetrying}
        showTextWhileLoading
        onClick={() => {
          setIsRetrying(true);
          if (paymentLink) {
            globalThis.location.assign(paymentLink);
            return;
          }
          view(viewHref, loadingKey);
        }}
        className={className}
        data-testid="transactionactionbutton-button"
      >
        {isRetrying ? "Retrying…" : "Retry"}
      </Button>
    );
  }

  return (
    <Button
      size={fullWidth ? "md" : "sm"}
      color="secondary"
      iconTrailing={ArrowRight}
      isLoading={isViewLoading(loadingKey)}
      onClick={() => view(viewHref, loadingKey)}
      className={className}
      data-testid="transactionactionbutton-button-2"
    >
      View
    </Button>
  );
};

export default TransactionActionButton;
