import React from "react";
import InfoTooltip from "@/components/InfoTooltip";
import { InclusiveTaxNote } from "@/components/Tax/InclusiveTaxNote";
import { buildTaxSplitTooltip } from "@/lib/tax/display";
import type { FeeRow, FeeSummaryLike } from "@/lib/tax/feeSummary";
import formatAmount from "@/utils/formatAmount";
import { formatCurrency } from "../OnboardDevices/equipItems";

interface Props {
  grandTotal: number;
  currency: string;
  hasPending: boolean;
  totalFeesArray: FeeRow[];
  totalFeesSummary?: FeeSummaryLike;
  totalFee?: number;
  currencySymbol?: string;
  isLoading: boolean;
  isError: boolean;
}

// The device subtotal is already the "Grand total" line at the top of this card.
const HIDDEN_FEES = new Set(["Total Purchase Price"]);

const FEE_TOOLTIPS: Record<string, string> = {
  "Grand total": "Total price of the selected devices before onboarding fees.",
  "Total Onboarding Fee":
    "Flat fee for provisioning, configuration, and delivery coordination.",
  "Insurance Fee":
    "Coverage for the devices while in transit and during onboarding.",
  "Platform Fee": "Rayda platform service charge for this order.",
  "Storage Fee": "Charge for holding devices in storage before deployment.",
};

const FeeLine: React.FC<{
  label: string;
  value: string;
  tooltip?: string;
}> = ({ label, value, tooltip }) => (
  <div className="flex items-center justify-between gap-3 text-sm">
    <div className="flex items-center gap-1.5">
      <span className="font-medium text-gray-700">{label}</span>
      {tooltip && (
        <InfoTooltip
          content={tooltip}
          width="280px"
          tooltipTrigger={
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[11px] font-semibold text-gray-400 ring-1 ring-gray-300">
              ?
            </span>
          }
        />
      )}
    </div>
    <span className="font-medium tabular-nums text-gray-900">{value}</span>
  </div>
);

const OnboardSummaryFees: React.FC<Props> = ({
  grandTotal,
  currency,
  hasPending,
  totalFeesArray,
  totalFeesSummary,
  totalFee,
  currencySymbol = "",
  isLoading,
  isError,
}) => {
  const fees = totalFeesArray.filter((fee) => !HIDDEN_FEES.has(fee.name));
  const fmt = (value: number) =>
    `${currencySymbol}${formatAmount((value ?? 0).toString())}`;
  const deviceTax = Number(
    totalFeesSummary?.device_tax ??
      totalFeesSummary?.tax_metadata?.device_tax_amount ??
      0,
  );
  const serviceTax = Number(
    totalFeesSummary?.service_tax ??
      totalFeesSummary?.tax_metadata?.service_tax_amount ??
      0,
  );
  const taxTooltip =
    deviceTax > 0 || serviceTax > 0
      ? buildTaxSplitTooltip(currencySymbol, deviceTax, serviceTax)
      : undefined;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
      <FeeLine
        label="Grand total"
        value={`${formatCurrency(grandTotal, currency)}${
          hasPending ? " + pending" : ""
        }`}
        tooltip={FEE_TOOLTIPS["Grand total"]}
      />

      {isLoading && <p className="text-sm text-gray-500">Calculating fees…</p>}

      {isError && (
        <p className="text-sm text-red-600">
          Couldn&apos;t load onboarding fees.
        </p>
      )}

      {!isLoading &&
        !isError &&
        fees.map((fee) => (
          <FeeLine
            key={fee.key}
            label={fee.name}
            value={fmt(fee.value)}
            tooltip={fee.key === "tax" ? taxTooltip : FEE_TOOLTIPS[fee.name]}
          />
        ))}

      <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-gray-100 pt-4">
        <span className="text-sm text-gray-600">
          Total Fees <InclusiveTaxNote />
        </span>
        <span className="text-2xl font-semibold tabular-nums text-gray-900">
          {isLoading || totalFee == null ? "…" : fmt(totalFee)}
        </span>
      </div>
    </div>
  );
};

export default OnboardSummaryFees;
