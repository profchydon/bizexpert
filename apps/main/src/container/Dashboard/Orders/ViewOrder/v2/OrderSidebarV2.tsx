import React from "react";
import dayjs from "dayjs";
import ReactCountryFlag from "react-country-flag";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CustomTooltip from "@/components/CustomTooltip";
import formatAmount from "@/utils/formatAmount";
import { IOrder } from "@/types/orders";
import { OrderFlowType } from "@/types/offboarding";
import OrderStatusBadgeV2 from "../../v2/components/OrderStatusBadgeV2";
import OrderTypeBadgeV2 from "../../v2/components/OrderTypeBadgeV2";
import OrderSignatureBadgeV2 from "../../v2/components/OrderSignatureBadgeV2";
import {
  deriveOrderDisplayStatus,
  orderCutoffMessage,
} from "@/utils/cancellationEligibility";
import {
  DEVICE_CONFIG_LABEL,
  DEVICE_CONFIG_TOOLTIP,
  getOrderDeviceConfigs,
} from "./orderDeviceConfig";
import { getExpectedDateField, getItemsCountText } from "./orderSidebarFields";
import { storageToEmployeeDeliveryCountries } from "../../v2/storageToEmployeeDeliveryCountry";
import { deriveCancellationView } from "./cancel/mapCancellationInfo";

interface Props {
  order: IOrder;
  showCancelButton?: boolean;
  cancelLabel?: string;
  onCancelClick?: () => void;
  unavailableMessage?: string | null;
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col gap-1">
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <div className="text-base font-medium text-gray-900">{children}</div>
  </div>
);

const OrderSidebarV2: React.FC<Props> = ({
  order,
  showCancelButton,
  cancelLabel = "Request cancel",
  onCancelClick,
  unavailableMessage,
}) => {
  const orderType = order?.type as unknown as OrderFlowType;
  const expectedDate = getExpectedDateField(order);
  const managedConfigs =
    orderType === "offboarding" ? [] : getOrderDeviceConfigs(order);
  const cutoffMessage = unavailableMessage ?? orderCutoffMessage(order);
  const displayStatus =
    deriveCancellationView(order) === "requested"
      ? "awaiting_cancellation"
      : deriveOrderDisplayStatus(order);
  const deliveryCountry = storageToEmployeeDeliveryCountries(order)[0];
  const countryName = deliveryCountry?.name || order.country;
  const countryCode = deliveryCountry
    ? deliveryCountry.code
    : order.country_code || "";

  return (
    <div className="w-full shrink-0 self-start rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:w-64">
      <div className="flex flex-col gap-5">
        <Field label="Order date">
          {dayjs(order.order_date).format("MMM DD, YYYY")}
        </Field>
        {expectedDate && (
          <Field label={expectedDate.label}>
            <div className="flex flex-col gap-1">
              <span>{expectedDate.value}</span>
              {expectedDate.deltaDays != null &&
                expectedDate.deltaDays !== 0 &&
                expectedDate.previousValue && (
                  <span className="text-sm text-gray-500">
                    Moved {Math.abs(expectedDate.deltaDays)} day
                    {Math.abs(expectedDate.deltaDays) === 1 ? "" : "s"}{" "}
                    {expectedDate.deltaDays < 0 ? "earlier" : "later"} (was{" "}
                    {expectedDate.previousValue})
                  </span>
                )}
            </div>
          </Field>
        )}
        <Field label="Ordered by">{order.ordered_by || "-"}</Field>
        <Field label="Payment method">{order.payment_method || "-"}</Field>
        <Field label="Items count">{getItemsCountText(order)}</Field>
        <Field label="Total amount">
          {`${order.currency || ""} ${formatAmount(order.total_amount)}`}
        </Field>
        <Field label="Status">
          <OrderStatusBadgeV2 status={displayStatus} />
        </Field>
        <Field label="Type">
          <OrderTypeBadgeV2 type={order.type} />
        </Field>
        {managedConfigs.length > 0 && (
          <Field label="Configuration">
            <div className="flex flex-wrap items-center gap-1.5">
              {managedConfigs.map((config) => (
                <CustomTooltip
                  key={config}
                  content={DEVICE_CONFIG_TOOLTIP[config]}
                >
                  <Badge
                    variant="outline"
                    className="cursor-default rounded-full border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium text-gray-600 hover:bg-white"
                  >
                    {DEVICE_CONFIG_LABEL[config]}
                  </Badge>
                </CustomTooltip>
              ))}
            </div>
          </Field>
        )}
        <Field label="Signature">
          <OrderSignatureBadgeV2
            signatureRequested={order.signature_requested}
            signatureStatus={order.signature_status}
          />
        </Field>
        {orderType !== "offboarding" && countryName && (
          <Field label="Country">
            <div className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode={countryCode}
                svg
                style={{ width: "24px", height: "24px" }}
              />
              <span>{countryName}</span>
            </div>
          </Field>
        )}
        {showCancelButton && (
          <Button
            variant="outline"
            className="w-full border-error-300 font-semibold text-error-700 hover:bg-error-50 hover:text-error-800"
            onClick={onCancelClick}
            data-testid="ordersidebarv2-button"
          >
            {cancelLabel}
          </Button>
        )}
        {!showCancelButton && cutoffMessage && (
          <p className="text-sm text-gray-600">{cutoffMessage}</p>
        )}
      </div>
    </div>
  );
};

export default OrderSidebarV2;
