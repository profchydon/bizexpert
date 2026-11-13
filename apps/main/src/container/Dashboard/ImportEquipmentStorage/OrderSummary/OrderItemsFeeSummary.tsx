import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import InfoTooltip from "@/components/InfoTooltip";
import formatAmount from "@/utils/formatAmount";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import PageState from "@/components/PageState";
import { IEmployees } from "@/types/employees";
import useStorageOnboardFeeAction from "@/hooks/useStorageOnboardFeeAction";

import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";

interface OrderItemsFeeSummaryProps {
  employee?: IEmployees;
  totalItems?: number;
}

const OrderItemsFeeSummary: React.FC<OrderItemsFeeSummaryProps> = ({
  employee,
  totalItems,
}) => {
  const currencySymbol = useWorkspaceCurrencySymbol();

  const { isError, isLoading, employeeFees, totalEquipment } =
    useStorageOnboardFeeAction({ employees: employee! });

  const finalTotalEquipment = totalItems ?? totalEquipment;

  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className="mt-2 bg-gray-50/80 rounded-xl p-5 border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <span className="font-medium">Items</span>
          <span className="text-gray-500">{finalTotalEquipment ?? 0}</span>
        </div>

        {employeeFees?.plan?.amount != null && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">
                  {employeeFees?.plan?.service_type || "Service fee"}
                </span>
                <InfoTooltip
                  content={
                    <p>Standard fee for processing on-boarding requests</p>
                  }
                />
              </div>
              <span className="shrink-0 tabular-nums font-medium text-gray-900">
                {currencySymbol}
                {formatAmount(employeeFees?.plan?.amount?.toString())}
              </span>
            </div>
          </div>
        )}

        <Separator className="border-gray-200" />

        <div className="flex items-center justify-between">
          <span className="text-base text-gray-900">Total</span>
          <span className="text-base font-bold text-gray-900 shrink-0 tabular-nums">
            {currencySymbol}
            {formatAmount(employeeFees?.total_fee?.toString())}
          </span>
        </div>
      </div>
    </PageState>
  );
};

export default OrderItemsFeeSummary;
