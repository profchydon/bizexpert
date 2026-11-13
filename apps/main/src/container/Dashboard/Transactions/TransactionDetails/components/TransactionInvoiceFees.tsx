import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import formatAmount from "@/utils/formatAmount";
import { TransactionInvoiceTotals } from "../transactionInvoiceViewModel";

interface Props {
  currencySymbol: string;
  totals: TransactionInvoiceTotals;
}

const TotalsRow = ({
  label,
  value,
  help,
}: {
  label: string;
  value: string;
  help?: string;
}) => (
  <div className="flex items-baseline justify-between gap-4">
    <div className="flex items-center gap-2">
      <span className="text-sm text-tertiary">{label}</span>
      {help ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex text-quaternary"
                aria-label={`${label} breakdown`}
              >
                <HelpCircle className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">{help}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
    </div>
    <span className="text-sm tabular-nums text-primary">{value}</span>
  </div>
);

const TransactionInvoiceFees = ({ currencySymbol, totals }: Props) => {
  const money = (value: number) => `${currencySymbol}${formatAmount(value)}`;

  return (
    <div className="flex flex-col gap-3 border-t border-secondary px-6 py-5">
      <TotalsRow label="Subtotal" value={money(totals.subtotal)} />
      <TotalsRow
        label={totals.vatLabel}
        value={money(totals.vatTotal)}
        help={totals.vatTooltip}
      />
      {totals.gatewayFee > 0 ? (
        <TotalsRow
          label="Payment gateway fee"
          value={money(totals.gatewayFee)}
          help="Collected by the payment processor and passed through. Not Rayda revenue."
        />
      ) : null}
      <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-secondary pt-4">
        <span className="text-md font-semibold text-primary">Total</span>
        <span className="text-display-xs font-semibold tracking-tight tabular-nums text-primary">
          {money(totals.total)}
        </span>
      </div>
    </div>
  );
};

export default TransactionInvoiceFees;
