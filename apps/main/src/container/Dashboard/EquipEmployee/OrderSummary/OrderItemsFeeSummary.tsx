import { Separator } from "@/components/ui/separator";
import InfoTooltip from "@/components/InfoTooltip";
import formatAmount from "@/utils/formatAmount";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import PageState from "@/components/PageState";
import { IEmployees } from "@/types/employees";
import useOnboardFeeAction from "@/hooks/useOnboardFeeAction";
import type { OrderFeeSummary } from "./orderFeeSummary";

import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";

interface OrderItemsFeeSummaryProps {
  employee?: IEmployees;
  buyToStorage?: boolean;
  feeSummary?: OrderFeeSummary;
  skipFeeQuery?: boolean;
  totalItems?: number;
}

const OrderItemsFeeSummary: React.FC<OrderItemsFeeSummaryProps> = ({
  employee,
  buyToStorage = false,
  feeSummary,
  skipFeeQuery = false,
  totalItems,
}) => {
  const currencySymbol = useWorkspaceCurrencySymbol();

  const feeAction = useOnboardFeeAction({
    employees: employee ?? [],
    buyToStorage,
    skipFeeQuery: skipFeeQuery || Boolean(feeSummary),
  });
  const employeeFees = feeSummary ?? feeAction.employeeFees;
  const totalEquipment = totalItems ?? feeAction.totalEquipment;

  const getFormattedAmount = (value?: number | string | null) => {
    const normalizedValue = Number(value ?? 0);
    if (Number.isNaN(normalizedValue)) {
      return formatAmount("0");
    }

    return formatAmount(String(normalizedValue));
  };

  return (
    <PageState isLoading={feeAction.isLoading} isError={feeAction.isError}>
      <div className="mt-2 bg-gray-50/80 rounded-xl p-5 border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <span className="font-medium">Items</span>
          <span className="text-gray-500">{totalEquipment ?? 0}</span>
        </div>

        <div className="flex flex-col gap-4">
          {employeeFees?.plan?.amount != null && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">
                  {employeeFees?.plan?.service_type || "Service fee"}
                </span>
                <InfoTooltip
                  content={<p>Standard fee for processing requests</p>}
                />
              </div>
              <span className="shrink-0 tabular-nums font-medium text-gray-900">
                {currencySymbol}
                {getFormattedAmount(employeeFees?.plan?.amount)}
              </span>
            </div>
          )}

          {employeeFees?.additional_fee?.insurance_fee != null &&
            Number(employeeFees.additional_fee.insurance_fee) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Insurance Fee</span>
                </div>
                <span className="shrink-0 tabular-nums font-medium text-gray-900">
                  {currencySymbol}
                  {getFormattedAmount(
                    employeeFees?.additional_fee?.insurance_fee,
                  )}
                </span>
              </div>
            )}

          {employeeFees?.purchase_price != null &&
            Number(employeeFees.purchase_price) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Purchase Price</span>
                </div>
                <span className="shrink-0 tabular-nums font-medium text-gray-900">
                  {currencySymbol}
                  {getFormattedAmount(employeeFees?.purchase_price)}
                </span>
              </div>
            )}
        </div>

        <Separator className="border-gray-200" />

        <div className="flex items-center justify-between">
          <span className="text-base text-gray-900">Total</span>
          <span className="text-base font-bold text-gray-900 shrink-0 tabular-nums">
            {currencySymbol}
            {getFormattedAmount(employeeFees?.total_fee)}
          </span>
        </div>
      </div>
    </PageState>
  );
};

export default OrderItemsFeeSummary;
