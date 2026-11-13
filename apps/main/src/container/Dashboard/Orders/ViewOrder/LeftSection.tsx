import React from "react";
import LeftSectionItem from "./LeftSectionItem";
import { Badge } from "@/components/ui/badge";
import { IOrder } from "@/types/orders";
import dayjs from "dayjs";
import formatAmount from "@/utils/formatAmount";
import ReactCountryFlag from "react-country-flag";
import { OrderFlowType, orderFlowTypeCheck } from "@/types/offboarding";
import {
  SignatureStatus,
  signatureStatusMap,
} from "@/utils/signatureStatusMap";
import { Button } from "@/components/ui/button";

interface Props {
  order: IOrder;
  showCancelButton?: boolean;
  onCancelClick?: () => void;
}

const LeftSection: React.FC<Props> = ({
  order,
  showCancelButton,
  onCancelClick,
}) => {
  const orderType = order?.type as unknown as OrderFlowType;
  const signatureRequired = order.signature_requested;

  let signatureKey: keyof typeof signatureStatusMap =
    SignatureStatus.NOT_REQUESTED;
  if (signatureRequired === true) signatureKey = "true";
  else if (signatureRequired === false) signatureKey = "false";
  else if (typeof signatureRequired === "string")
    signatureKey = signatureRequired as keyof typeof signatureStatusMap;
  const badge = signatureStatusMap[signatureKey];

  return (
    <div className="lg:flex lg:flex-col gap-8 sm:gap-6 grid grid-cols-2 sm:grid-cols-5">
      <LeftSectionItem
        title="Order date"
        description={dayjs(order.order_date).format("MMM DD, YYYY")}
      />
      <LeftSectionItem title="Ordered by" description={order.ordered_by} />
      <LeftSectionItem
        title="Payment method"
        description={order?.payment_method || "-"}
      />
      <LeftSectionItem
        title="Items count"
        // @ts-ignore
        description={`${order.quantity ?? order.sub_orders?.length ?? order.sub_orders?.data?.length}`}
      />
      <LeftSectionItem
        title="Total amount"
        description={
          // @ts-ignore
          `${order?.currency || ""} ${formatAmount(order?.total_amount)}`
        }
      />
      <LeftSectionItem
        title="Status"
        description={
          <>
            {order.status === "in_progress" && (
              <Badge variant={"pending"}>In progress</Badge>
            )}
            {order.status === "completed" && (
              <Badge variant={"success"}>Completed</Badge>
            )}
            {order.status === "awaiting" && (
              <Badge variant={"awaiting"}>Awaiting</Badge>
            )}
            {order.status === "cancelled" && (
              <Badge variant={"error"}>Cancelled</Badge>
            )}
            {order.status === "awaiting_cancellation" && (
              <Badge
                variant={"pending"}
                className="bg-warning-50 text-warning-700"
              >
                Awaiting Cancellation
              </Badge>
            )}
          </>
        }
      />
      <div className="col-span-2 sm:col-span-1">
        <LeftSectionItem
          title="Type"
          description={
            <>
              {orderFlowTypeCheck[orderType]?.label && (
                <div className="w-fit">
                  <Badge
                    className={orderFlowTypeCheck[orderType]?.className}
                    variant={orderFlowTypeCheck[orderType]?.variant as any}
                  >
                    {orderFlowTypeCheck[orderType]?.label}
                  </Badge>
                </div>
              )}
            </>
          }
        />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <LeftSectionItem
          title="Signature"
          description={
            <div className="w-fit">
              <Badge className={badge.className} variant={badge.variant as any}>
                {badge.label}
              </Badge>
            </div>
          }
        />
      </div>
      {orderType !== "offboarding" && order?.country && (
        <div className="col-span-2 sm:col-span-3">
          <LeftSectionItem
            title="Country"
            description={
              <div className="flex items-center gap-x-2">
                <ReactCountryFlag
                  countryCode={order?.country_code || ""}
                  className=""
                  svg
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                />
                <span>{order.country}</span>
              </div>
            }
          />
        </div>
      )}
      {showCancelButton && (
        <div className="col-span-2 sm:col-span-5 pt-2">
          <Button
            variant="outline"
            className="w-full border-error-300 text-error-700 hover:bg-error-50 hover:text-error-800 font-semibold"
            onClick={onCancelClick}
            data-testid="leftsection-button"
          >
            Request cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeftSection;
