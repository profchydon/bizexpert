import React from "react";
import CheckoutFeeRows from "@/components/Tax/CheckoutFeeRows";
import { InclusiveTaxNote } from "@/components/Tax/InclusiveTaxNote";
import {
  formatFeeAmount,
  type OffboardFeeBreakdown,
} from "./offboardFeeBreakdown";

interface Props {
  breakdown: OffboardFeeBreakdown;
  isLoading?: boolean;
}

const ServiceFeeBreakdown: React.FC<Props> = ({ breakdown, isLoading }) => {
  const { rows, feeSummary, total, currencySymbol } = breakdown;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
      <CheckoutFeeRows
        rows={rows}
        currencySymbol={currencySymbol}
        feeSummary={feeSummary}
        rowClassName="flex items-center justify-between gap-3 text-sm"
        labelClassName="font-medium text-gray-700"
        valueClassName="font-medium tabular-nums text-gray-900"
      />
      <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-gray-100 pt-4">
        <span className="text-sm text-gray-600">
          Total <InclusiveTaxNote />
        </span>
        <span className="text-2xl font-semibold tabular-nums text-gray-900">
          {isLoading ? "…" : formatFeeAmount(total, currencySymbol)}
        </span>
      </div>
    </div>
  );
};

export default ServiceFeeBreakdown;
