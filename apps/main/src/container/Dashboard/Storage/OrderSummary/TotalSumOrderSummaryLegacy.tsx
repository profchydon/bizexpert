import PageState from "@/components/PageState";
import { Separator } from "@/components/ui/separator";
import useStorageOnboardFeeAction from "@/hooks/useStorageOnboardFeeAction";
import { useAppSelector } from "@/store";
import { IEmployees } from "@/types/employees";
import formatAmount from "@/utils/formatAmount";
import { useSearchParams } from "next/navigation";
import React from "react";

const TotalSumOrderSummary = () => {
  const param = useSearchParams();
  const renewStorage = param.get("r_int");

  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  ) as IEmployees[];

  const {
    isLoading,
    isError,
    totalFeesSummary,
    totalFeesArray,
    totalEquipment,
  } = useStorageOnboardFeeAction({
    employees,
    renewInstance: !!renewStorage,
  });

  const currencySymbol = totalFeesSummary?.currency?.symbol;

  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className="space-y-4 pt-6">
        <div className="flex justify-between items-center text-lg text-gray-700">
          <span className="font-medium">Items</span>
          <span>{totalEquipment ?? 0}</span>
        </div>

        {totalFeesArray?.map((fee) => (
          <div
            key={fee.name}
            className="flex justify-between items-center text-lg text-gray-700"
          >
            <span className="font-medium">
              {fee.name.charAt(0).toUpperCase() +
                fee.name.slice(1).toLowerCase()}
            </span>
            <span>
              {currencySymbol}
              {formatAmount(fee.value.toString())}
            </span>
          </div>
        ))}

        <Separator />

        <div className="flex justify-between items-center text-2xl text-primary-700">
          <span>Sum total</span>
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
