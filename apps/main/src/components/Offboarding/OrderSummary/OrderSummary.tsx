"use client";

import { Separator } from "@/components/ui/separator";
import { InclusiveTaxNote } from "@/components/Tax/InclusiveTaxNote";
import { useTaxContext } from "@/hooks/useTaxContext";
import { buildFeeRows } from "@/lib/tax/feeSummary";
import { Offboard_asset } from "@/types/offboarding";
import formatAmount from "@/utils/formatAmount";
import { FC } from "react";

interface Props {
  data?: Offboard_asset[];
  feeData: Record<string, unknown>;
}

const OrderSummary: FC<Props> = ({ data, feeData }) => {
  const { mode: taxMode } = useTaxContext();
  const feeSummary = (feeData?.fee_summary ?? {}) as Record<string, unknown>;
  const rows = buildFeeRows(feeSummary, taxMode);
  const currencySymbol =
    (feeSummary.currency as { symbol?: string } | undefined)?.symbol ?? "";
  const totalFee = Number(feeSummary.total_fee ?? 0);

  return (
    <div className="mt-2 bg-gray-50/80 rounded-xl p-5 border border-gray-100 flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">Items</span>
        <span className="text-gray-500">{data?.length ?? 0}</span>
      </div>

      {rows.length > 0 && (
        <div className="flex flex-col gap-4">
          {rows.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-700">{item.name}</span>
              <span className="shrink-0 tabular-nums font-medium text-gray-900">
                {currencySymbol}
                {formatAmount(item.value)}
              </span>
            </div>
          ))}
        </div>
      )}

      <Separator className="border-gray-200" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-base text-gray-900">
          <span>Total</span>
          <InclusiveTaxNote />
        </div>
        <span className="text-base font-bold text-gray-900 shrink-0 tabular-nums">
          {currencySymbol}
          {formatAmount(totalFee)}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
