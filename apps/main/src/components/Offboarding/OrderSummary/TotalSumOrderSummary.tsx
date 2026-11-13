import PageState from "@/components/PageState";
import CheckoutFeeRows from "@/components/Tax/CheckoutFeeRows";
import { InclusiveTaxNote } from "@/components/Tax/InclusiveTaxNote";
import { Separator } from "@/components/ui/separator";
import { useTaxContext } from "@/hooks/useTaxContext";
import { buildFeeRows } from "@/lib/tax/feeSummary";
import { Offboard_asset } from "@/types/offboarding";
import formatAmount from "@/utils/formatAmount";
import React, { FC } from "react";

interface Props {
  feeData: Record<string, any>;
  allData: Offboard_asset[];
  isLoading: boolean;
  isError: boolean;
}

const TotalSumOrderSummary: FC<Props> = ({
  feeData,
  allData,
  isError,
  isLoading,
}) => {
  const feeSummary = feeData?.fee_summary || {};
  const { mode: taxMode, config } = useTaxContext();
  const items = buildFeeRows(feeSummary, taxMode, config);

  const totalItems = allData?.length;

  if (totalItems < 1) return null;

  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-lg text-gray-700">
          <span className="font-medium">Items</span>
          <span>{totalItems}</span>
        </div>

        <CheckoutFeeRows
          rows={items}
          currencySymbol={feeSummary?.currency?.symbol ?? ""}
          feeSummary={feeSummary}
        />

        <Separator className="bg-border-secondary" />

        <div className="flex justify-between items-center text-2xl text-primary-700">
          <div className="flex flex-col">
            <span>Sum total</span>
            <InclusiveTaxNote />
          </div>
          <span className="shrink-0 tabular-nums font-semibold">
            {feeSummary?.currency?.symbol}
            {formatAmount(feeSummary?.total_fee ?? 0)}
          </span>
        </div>
      </div>
    </PageState>
  );
};

export default TotalSumOrderSummary;
