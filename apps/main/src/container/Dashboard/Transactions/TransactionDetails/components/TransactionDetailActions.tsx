"use client";

import {
  ArrowRight,
  FileCheck02,
  RefreshCw01,
  ZapOff,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ITransactionDetail } from "@/types/transactions";
import {
  getTransactionDetailActionPresentation,
  resolveTransactionDetailClick,
  shouldShowTransactionDetailAction,
} from "../transactionDetailActionsPresentation";
import { useTrackedPaymentAssign } from "../useTrackedPaymentAssign";

interface Props {
  transaction?: ITransactionDetail;
}

const TransactionDetailActions = ({ transaction }: Props) => {
  const { isPaying, startPayment } = useTrackedPaymentAssign();

  if (!transaction) {
    return null;
  }

  if (
    !shouldShowTransactionDetailAction(transaction.status, transaction.invoice)
  ) {
    return null;
  }

  const presentation = getTransactionDetailActionPresentation(
    transaction.status,
  );
  const click = resolveTransactionDetailClick({
    status: transaction.status,
    paymentLink: transaction.payment_link,
    invoiceUrl: transaction.invoice?.url ?? transaction.invoice?.pdf_url,
  });

  const handleClick = () => {
    if (click.type === "receipt") {
      window.open(click.url, "_blank", "noopener,noreferrer");
      return;
    }

    if (click.type === "pay") {
      startPayment(click.url);
    }
  };

  const Icon =
    presentation.label === "View receipt"
      ? FileCheck02
      : presentation.label === "Retry payment"
        ? RefreshCw01
        : presentation.label === "Cancelled" || presentation.label === "Voided"
          ? ZapOff
          : ArrowRight;

  return (
    <Button
      size="md"
      color={presentation.color}
      iconLeading={Icon}
      isLoading={isPaying}
      showTextWhileLoading
      isDisabled={presentation.disabled || click.type === "none" || isPaying}
      onClick={handleClick}
      className="w-full"
      data-testid="transactiondetailactions-button"
    >
      {presentation.label}
    </Button>
  );
};

export default TransactionDetailActions;
