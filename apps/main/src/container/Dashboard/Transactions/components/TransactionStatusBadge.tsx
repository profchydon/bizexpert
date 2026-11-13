"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getTransactionStatusPresentation } from "../utils/transactionStatusPresentation";

interface Props {
  status: string;
  refund?: number;
  amount?: number | string;
  currencySymbol?: string;
  showDetail?: boolean;
}

const TransactionStatusBadge = ({
  status,
  refund,
  amount,
  currencySymbol,
  showDetail = false,
}: Props) => {
  const presentation = getTransactionStatusPresentation(status, {
    refund,
    amount,
    currencySymbol,
  });

  if (!presentation.label) {
    return null;
  }

  const badge = (
    <Badge
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap border font-medium",
        presentation.className,
      )}
      variant={presentation.variant as any}
    >
      {presentation.dotClassName ? (
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            presentation.dotClassName,
          )}
          aria-hidden="true"
        />
      ) : null}
      <span>{presentation.label}</span>
      {showDetail && presentation.detail ? (
        <span className="font-semibold tabular-nums">
          {presentation.detail}
        </span>
      ) : null}
    </Badge>
  );

  if (!presentation.tooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex w-fit">{badge}</span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-center">
          {presentation.tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TransactionStatusBadge;
