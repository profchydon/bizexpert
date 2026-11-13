"use client";

import {
  ArrowRight,
  FileCheck02,
  RefreshCw01,
  ZapOff,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { getTransactionDetailAction } from "../transactionActionMeta";
import { ITransactionDetail } from "@/types/transactions";

const ICONS = {
  receipt: FileCheck02,
  pay: ArrowRight,
  retry: RefreshCw01,
  off: ZapOff,
};

export function TransactionDetailActions({
  transaction,
}: {
  transaction?: ITransactionDetail;
}) {
  const action = getTransactionDetailAction({
    status: transaction?.status,
    paymentLink: transaction?.payment_link,
    invoice: transaction?.invoice,
  });
  if (!action) return null;
  const Icon = ICONS[action.icon];
  const openHref = action.href
    ? () => {
        if (action.icon === "receipt") {
          globalThis.open(action.href, "_blank", "noopener,noreferrer");
          return;
        }
        globalThis.location.assign(action.href!);
      }
    : undefined;

  return (
    <Button
      size="md"
      color={action.color}
      iconLeading={Icon}
      isDisabled={action.disabled}
      onClick={openHref}
      className="w-full"
      data-testid="transactiondetailactions-button"
    >
      {action.label}
    </Button>
  );
}
