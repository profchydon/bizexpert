import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { buildTaxSplitTooltip } from "@/lib/tax/display";
import type { FeeRow, FeeSummaryLike } from "@/lib/tax/feeSummary";
import formatAmount from "@/utils/formatAmount";

const TAX_ROW_KEY = "tax";

interface Props {
  rows: FeeRow[];
  currencySymbol: string;
  feeSummary?: FeeSummaryLike;
  rowClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
}

const CheckoutFeeRows = ({
  rows,
  currencySymbol,
  feeSummary,
  rowClassName = "flex justify-between items-center text-lg text-gray-700",
  labelClassName = "font-medium",
  valueClassName = "shrink-0 tabular-nums",
}: Props) => {
  const deviceTax = Number(
    feeSummary?.device_tax ?? feeSummary?.tax_metadata?.device_tax_amount ?? 0,
  );
  const serviceTax = Number(
    feeSummary?.service_tax ??
      feeSummary?.tax_metadata?.service_tax_amount ??
      0,
  );
  const taxTooltip =
    deviceTax > 0 || serviceTax > 0
      ? buildTaxSplitTooltip(currencySymbol, deviceTax, serviceTax)
      : null;

  return (
    <>
      {rows.map((fee) => (
        <div key={fee.key} className={rowClassName}>
          <span
            className={`inline-flex items-center gap-1.5 ${labelClassName}`}
          >
            {fee.name}
            {fee.key === TAX_ROW_KEY && taxTooltip ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex text-gray-400 hover:text-gray-600"
                      aria-label="Tax breakdown"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    {taxTooltip}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}
          </span>
          <span className={valueClassName}>
            {currencySymbol}
            {formatAmount(fee.value)}
          </span>
        </div>
      ))}
    </>
  );
};

export default CheckoutFeeRows;
