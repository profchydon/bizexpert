import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import DrawerRight from "@/components/DrawerRight";
import { hasAccess, IUserRole } from "@/utils/hasAccess";
import { useOrderScopedCompanyId } from "@/hooks/useOrderScopedCompanyId";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useCancelSubOrderMutation } from "@/api/baseQueries/companiesApi/ordersApi/cancelSubOrder";
import displayCancellationSuccess from "@/utils/displayCancellationSuccess";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { IAsset } from "@/types/assets";
import { IOrder, ISubOrder } from "@/types/orders";
import SubOrderCancelModal from "@/container/Dashboard/Orders/ViewOrder/OrderInformationTable/SubOrderCancelModal";
import ReferenceItemContent from "./ReferenceItemContent";
import { buildItemSlideoutData } from "./itemSlideoutData";

const NON_CANCELABLE = new Set([
  "completed",
  "cancelled",
  "order_cancelled",
  "delivered",
  "order_delivered",
  "collection_completed",
  "sold",
  "picked_up",
  "in_storage",
  "awaiting_cancellation",
]);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  asset?: IAsset;
  order: IOrder;
  subOrder?: ISubOrder;
  focusedNoteIndex?: number | null;
}

const ReferenceOrderItemSlideout: React.FC<Props> = ({
  isOpen,
  onClose,
  asset,
  order,
  subOrder,
  focusedNoteIndex,
}) => {
  const { getUserDetails } = useAuthUserDetail();
  const userRole = getUserDetails()?.role as IUserRole;
  const companyId = useOrderScopedCompanyId(order);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const [cancelSubOrderMutation, { isLoading: isCancelling }] =
    useCancelSubOrderMutation();

  const data = buildItemSlideoutData(asset, order, subOrder);
  const status = localStatus || data.status;
  const canRequestCancel = !NON_CANCELABLE.has((status || "").toLowerCase());
  const notes = (asset as { note?: unknown[] } | undefined)?.note;
  const canSeeNotes = hasAccess(userRole, [
    "Super Administrator",
    "Administrator",
  ]);

  const handleConfirmCancel = async (reason: string, details: string) => {
    try {
      await cancelSubOrderMutation({
        companyId,
        orderId: order?.id,
        subOrderId: subOrder?.id,
        reason,
        additional_details: details,
        include_related_items: false,
      }).unwrap();
      setCancelModalOpen(false);
      setLocalStatus("awaiting_cancellation");
      displayCancellationSuccess();
    } catch (error) {
      displayErrorMessage(
        "Failed to cancel sub-order",
        (error as { data?: { message?: string } })?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  const close = () => {
    setLocalStatus(null);
    onClose();
  };

  return (
    <>
      <DrawerRight
        isOpen={isOpen}
        onClose={close}
        onCancel={close}
        hideHeader
        hideCloseButton
        hideSaveButton
        cancelText="Cancel"
        enableOverlay
        width="440"
        className="px-0 pt-0"
        addSecondaryButton={
          <Button
            className="gap-2 bg-primary-50 text-primary-700 hover:bg-primary-100"
            onClick={close}
            data-testid="referenceorderitemslideout-button"
          >
            <ArrowLeft className="size-5" />
            Back
          </Button>
        }
        data-testid="referenceorderitemslideout-drawerright"
      >
        <ReferenceItemContent
          data={data}
          orderNumber={order.order_number}
          status={status}
          canRequestCancel={canRequestCancel}
          notes={notes}
          canSeeNotes={canSeeNotes}
          focusedNoteIndex={focusedNoteIndex}
          onClose={close}
          onRequestCancel={() => setCancelModalOpen(true)}
        />
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

export default ReferenceOrderItemSlideout;
