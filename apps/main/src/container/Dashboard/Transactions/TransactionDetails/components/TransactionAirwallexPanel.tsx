"use client";

import { Check, Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useClipboard } from "@/hooks/use-clipboard";
import { ITransactionDetail } from "@/types/transactions";
import TransactionDetailActions from "./TransactionDetailActions";

interface Props {
  transaction?: ITransactionDetail;
}

const TransactionAirwallexPanel = ({ transaction }: Props) => {
  const airwallexId = transaction?.invoice?.id?.trim();
  const actions = <TransactionDetailActions transaction={transaction} />;

  if (!airwallexId) {
    if (!transaction?.invoice) {
      return actions;
    }

    return (
      <>
        <div className="h-px w-full bg-gray-200" />
        {actions}
      </>
    );
  }

  const { copy, copied } = useClipboard();
  const isCopied = copied === airwallexId;

  const handleCopy = async () => {
    await copy(airwallexId, airwallexId);
  };

  return (
    <>
      <div className="h-px w-full bg-gray-200" />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Airwallex transaction ID
          </span>
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 py-1.5 pr-1.5 pl-2.5">
            <span
              className="min-w-0 flex-1 truncate font-mono text-xs tabular-nums text-gray-700"
              title={airwallexId}
            >
              {airwallexId}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-white hover:text-gray-600"
                    aria-label={
                      isCopied ? "Copied" : "Copy Airwallex transaction ID"
                    }
                  >
                    {isCopied ? (
                      <Check className="size-3.5 text-success-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {isCopied ? "Copied" : "Copy ID"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {actions}
      </div>
    </>
  );
};

export default TransactionAirwallexPanel;
