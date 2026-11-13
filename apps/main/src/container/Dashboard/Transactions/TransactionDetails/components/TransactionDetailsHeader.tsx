"use client";

import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { useListReturnHref } from "@/hooks/useTablePageQuery";
import routes from "@/routes";
import { CopyReferenceButton } from "../../components/CopyReferenceButton";

import { IAllTransaction } from "@/types/transactions";

interface Props {
  reference?: string | null;
  status?: IAllTransaction["status"];
  onBack: () => void;
}

const descriptionForStatus = (status?: IAllTransaction["status"]) => {
  if (status === "Partial Refund") {
    return "Part of this checkout was cancelled. Review the refund breakdown and which linked orders are still active.";
  }

  if (status === "Refunded") {
    return "This transaction was fully refunded. Review the breakdown and linked orders below.";
  }

  return "Track payment status, amount, and linked orders for this transaction.";
};

const TransactionDetailsHeader = ({ reference, status, onBack }: Props) => {
  const transactionsHref = useListReturnHref(routes.TRANSACTIONS);
  const handleCopyReference = async () => {
    if (
      !reference ||
      typeof navigator === "undefined" ||
      !navigator.clipboard
    ) {
      return;
    }
    await navigator.clipboard.writeText(reference);
  };

  return (
    <PageHeader
      breadCrumbs={[
        <Link key="transactions" href={transactionsHref}>
          Transactions report
        </Link>,
        reference || "Transaction details",
      ]}
      pageTitle={
        <span className="inline-flex items-center gap-2">
          <span className="tabular-nums">
            {reference || "Transaction details"}
          </span>
          {reference ? (
            <CopyReferenceButton value={reference} className="size-9" />
          ) : null}
        </span>
      }
      pageDescription={descriptionForStatus(status)}
      onBack={onBack}
    />
  );
};

export default TransactionDetailsHeader;
