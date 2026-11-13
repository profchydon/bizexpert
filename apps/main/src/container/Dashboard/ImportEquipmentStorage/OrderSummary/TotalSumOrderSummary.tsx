import PageState from "@/components/PageState";
import CheckoutFeeRows from "@/components/Tax/CheckoutFeeRows";
import { InclusiveTaxNote } from "@/components/Tax/InclusiveTaxNote";
import { Separator } from "@/components/ui/separator";
import useStorageOnboardFeeAction from "@/hooks/useStorageOnboardFeeAction";
import { useAppSelector } from "@/store";
import { IEmployees } from "@/types/employees";
import formatAmount from "@/utils/formatAmount";
import React from "react";

const TotalSumOrderSummary = () => {
  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  ) as IEmployees[];

  const {
    isLoading,
    isError,
    totalFeesSummary,
    totalFeesArray,
    totalEquipment,
  } = useStorageOnboardFeeAction({ employees });

  const currencySymbol = totalFeesSummary?.currency?.symbol;

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
            currencySymbol={currencySymbol ?? ""}
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
            {formatAmount(totalFeesSummary?.total_fee?.toString())}
          </span>
        </div>
      </div>
    </PageState>
  );
};

export default TotalSumOrderSummary;
