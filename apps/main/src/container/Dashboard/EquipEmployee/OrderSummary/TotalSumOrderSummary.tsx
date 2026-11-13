import PageState from "@/components/PageState";
import CheckoutFeeRows from "@/components/Tax/CheckoutFeeRows";
import { InclusiveTaxNote } from "@/components/Tax/InclusiveTaxNote";
import { Separator } from "@/components/ui/separator";
import type { FeeRow, FeeSummaryLike } from "@/lib/tax/feeSummary";
import formatAmount from "@/utils/formatAmount";
import React from "react";

interface Props {
  isLoading: boolean;
  isError: boolean;
  currencySymbol: string;
  totalFeesArray: FeeRow[];
  totalFeesSummary?: FeeSummaryLike;
  totalEquipment: number;
  totalFee: number;
}
const TotalSumOrderSummary: React.FC<Props> = ({
  currencySymbol,
  isError,
  isLoading,
  totalEquipment,
  totalFeesArray,
  totalFeesSummary,
  totalFee,
}) => {
  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className="space-y-4 pt-6">
        <div className="flex justify-between items-center text-lg text-gray-700">
          <span className="font-medium">Items</span>
          <span>{totalEquipment ?? 0}</span>
        </div>

        {totalFeesArray?.length ? (
          <CheckoutFeeRows
            rows={totalFeesArray}
            currencySymbol={currencySymbol}
            feeSummary={totalFeesSummary}
          />
        ) : null}

        <Separator />

        <div className="flex justify-between items-center text-2xl text-primary-700">
          <div className="flex flex-col">
            <span>Sum total</span>
            <InclusiveTaxNote />
          </div>
          <span className="font-semibold">
            {currencySymbol}
            {formatAmount((totalFee ?? 0).toString())}
          </span>
        </div>
      </div>
    </PageState>
  );
};

export default TotalSumOrderSummary;
