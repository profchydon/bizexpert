import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import DrawerRight from "@/components/DrawerRight";
import Itemprofile from "@/assets/images/item_profile_phote.png";
import Left_arrow from "@/assets/images/left_arrw.png";
import { OrderDetailItemTimeline } from "./OrderDetailItemTimeLine";
import { IAsset } from "@/types/assets";
import { Badge } from "@/components/ui/badge";
import formatAmount from "@/utils/formatAmount";
import { IOrder, ISubOrder } from "@/types/orders";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useOrderScopedCompanyId } from "@/hooks/useOrderScopedCompanyId";
import { OrderNoteActivity } from "../IndividualEmployee/OrderNoteActivity";
import { ASSET_ORDER_STATUS, orderStatusMap } from "@/utils/orderStatusMap";
import { signatureStatusMap } from "@/utils/signatureStatusMap";
import SubOrderCancelModal from "@/container/Dashboard/Orders/ViewOrder/OrderInformationTable/SubOrderCancelModal";
import { useCancelSubOrderMutation } from "@/api/baseQueries/companiesApi/ordersApi/cancelSubOrder";
import displayCancellationSuccess from "@/utils/displayCancellationSuccess";
import displayErrorMessage from "@/utils/displayErrorMessage";

import { subOrderCanCancel } from "@/utils/cancellationEligibility";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  asset?: IAsset;
  order: IOrder;
  subOrder?: ISubOrder;
  focusedNoteIndex?: number | null;
}

const OrderDetailItem: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  asset,
  order,
  subOrder,
  focusedNoteIndex,
}) => {
  const companyId = useOrderScopedCompanyId(order);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelSubOrderMutation, { isLoading: isCancelling }] =
    useCancelSubOrderMutation();
  const [localStatus, setLocalStatus] = useState<string | null>(null);

  const status = (localStatus || asset?.status) as ASSET_ORDER_STATUS;

  const canRequestCancel = subOrderCanCancel(subOrder);

  const handleConfirmCancel = async (
    reason: string,
    additionalDetails: string,
  ) => {
    try {
      const payload = {
        companyId,
        orderId: order?.id,
        subOrderId: subOrder?.id,
        reason,
        additional_details: additionalDetails,
        include_related_items: false,
      };
      await cancelSubOrderMutation(payload).unwrap();
      setCancelModalOpen(false);
      setLocalStatus("awaiting_cancellation");
      displayCancellationSuccess();
    } catch (error: any) {
      displayErrorMessage(
        "Failed to cancel sub-order",
        error?.data?.message || "Something went wrong. Please try again.",
      );
    }
  };

  const isSignatureRequested = (asset as any)?.signature_requested;
  const signatureBadge =
    signatureStatusMap[
      String(isSignatureRequested) as keyof typeof signatureStatusMap
    ] || signatureStatusMap["not_requested"];

  return (
    <>
      <DrawerRight
        isOpen={isOpen}
        onClose={() => {
          setLocalStatus(null);
          onClose();
        }}
        onCancel={() => {
          setLocalStatus(null);
          onClose();
        }}
        onSave={onSave}
        drawerTitle={order.order_number}
        drawerDescription=""
        hideDefaultFooterBtn
        data-testid="orderdetailitem-drawerright"
      >
        <div className="flex flex-col mb-24">
          <div className="flex flex-col items-center flex-grow mb-24 ">
            <div className="absolute z-[50] top-[60px] left-0 right-0 grid border-b place-content-start my-auto w-full bg-white">
              <div className="flex flex-row gap-x-6 pl-2 py-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={(asset?.images[0] as any) || Itemprofile}
                    alt="asset_image"
                  />
                </Avatar>
                <div className="space-y-2">
                  <span className="font-semibold text-lg text-black">
                    Order item #1
                  </span>
                  <div className="flex gap-x-2">
                    {orderStatusMap[status]?.label && (
                      <div className="w-fit">
                        <Badge
                          className={orderStatusMap[status]?.className}
                          variant={orderStatusMap[status]?.variant as any}
                        >
                          {orderStatusMap[status]?.icon}
                          {orderStatusMap[status]?.label}
                        </Badge>
                      </div>
                    )}
                    <Badge
                      className={signatureBadge.className}
                      variant={signatureBadge.variant as any}
                    >
                      {signatureBadge.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {canRequestCancel && (
            <div className="flex flex-col items-end pb-6">
              <Button
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50 font-semibold"
                onClick={() => setCancelModalOpen(true)}
                data-testid="orderdetailitem-button"
              >
                Request Cancel
              </Button>
            </div>
          )}
          <div className="flex flex-col pt-4 pb-6 border-b border-gray-200 space-y-2">
            <span className="font-semibold text-sm text-gray-700">Item</span>
            <span className="font-normal text-sm text-gray-600">
              {asset?.name} {asset?.make} - {asset?.model}
            </span>
          </div>
          <div className="flex flex-col pt-4 pb-6 border-b border-gray-200 space-y-2">
            <span className="font-semibold text-sm text-gray-700">
              Tracking number
            </span>
            {(asset as any)?.tracking_no ? (
              <a
                href={`/track/${(asset as any)?.tracking_no}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline cursor-pointer transition-colors"
              >
                {(asset as any)?.tracking_no}
              </a>
            ) : (
              <Badge variant="red">Not available</Badge>
            )}
          </div>
          <div className="grid place-content-start my-auto w-full pt-4 pb-6 border-b border-gray-200">
            <div className="flex flex-row gap-x-28">
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-700">
                  Price
                </span>
                <span className="font-normal text-sm text-gray-600">
                  {asset?.asset_pricing?.currency.symbol!}{" "}
                  {formatAmount(asset?.asset_pricing?.amount!)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-700">
                  Phone number
                </span>
                <span className="font-normal text-sm text-gray-600">-</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col pt-4 pb-6 border-b border-gray-200">
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-700">
                Courier
              </span>
              <span className="font-normal text-sm text-gray-600">-</span>
            </div>
          </div>
          <div className="flex flex-col pt-4 pb-6 border-b border-gray-200">
            <div className="flex flex-col space-y-1">
              <span className="font-semibold text-sm text-gray-900">
                Order history
              </span>
              <span className="font-normal text-sm text-gray-600">
                Track the progress of your order from confirmation to delivery
              </span>
            </div>
          </div>

          <OrderDetailItemTimeline asset={asset as any} />

          {(asset as any)?.note?.length > 0 && (
            <div className="flex flex-col mt-10 pb-6 border-t border-gray-200">
              <OrderNoteActivity
                notes={(asset as any)?.note}
                focusedNoteIndex={focusedNoteIndex}
              />
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t bg-white px-6 py-4 ">
          <div className="grid place-content-end my-auto h-full w-full">
            <div className="flex gap-x-6 ">
              <Button
                className="bg-[#F0F6FF] border-[#F0F6FF] text-sm text-[#003999] font-semibold"
                onClick={onClose}
                data-testid="orderdetailitem-button-2"
              >
                <img
                  className="text-sm pr-1 inline-block align-middle"
                  src={Left_arrow.src}
                  alt=".."
                />
                <span className="inline-block align-middle">Back</span>
              </Button>
              <Button
                className="text-sm font-semibold"
                variant="outline"
                onClick={onClose}
                data-testid="orderdetailitem-button-3"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DrawerRight>

      <SubOrderCancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        subOrder={
          subOrder && asset ? { ...subOrder, assets: [asset] } : subOrder
        }
        orderNumber={order.order_number}
        orderId={order.id}
        currency={order.currency}
        onConfirm={handleConfirmCancel}
        isLoading={isCancelling}
      />
    </>
  );
};

export default OrderDetailItem;
