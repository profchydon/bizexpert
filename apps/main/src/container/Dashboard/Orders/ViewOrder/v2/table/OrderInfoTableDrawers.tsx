import React from "react";
import { IAsset } from "@/types/assets";
import { IOrder, ISubOrder } from "@/types/orders";
import { OrderFlowType } from "@/types/offboarding";
import IndividualEmployee from "@/components/Drawers/IndividualEmployee";
import ReferenceOrderItemSlideout from "@/components/Drawers/OrderDetailItem/ReferenceOrderItemSlideout";
import SubOrderCancelModal from "../../OrderInformationTable/SubOrderCancelModal";

interface Props {
  order: IOrder;
  subOrderDetail?: ISubOrder;
  setSubOrderDetail: (value?: ISubOrder) => void;
  asset?: IAsset;
  setAsset: (value?: IAsset) => void;
  cancelSubOrder?: ISubOrder;
  setCancelSubOrder: (value?: ISubOrder) => void;
  onConfirmCancel: (reason: string, details: string) => void;
  isCancelling?: boolean;
}

const OrderInfoTableDrawers: React.FC<Props> = ({
  order,
  subOrderDetail,
  setSubOrderDetail,
  asset,
  setAsset,
  cancelSubOrder,
  setCancelSubOrder,
  onConfirmCancel,
  isCancelling,
}) => (
  <>
    <IndividualEmployee
      isOpen={Boolean(subOrderDetail)}
      onClose={() => setSubOrderDetail(undefined)}
      onOpen={(subOrder) => setSubOrderDetail(subOrder)}
      subOrderDetail={subOrderDetail}
      order={order}
      onSave={() => null}
      onView={(a) => setAsset(a)}
      actionType={order?.type as unknown as OrderFlowType}
      focusedNoteIndex={null}
    />

    <ReferenceOrderItemSlideout
      isOpen={Boolean(asset)}
      onClose={() => setAsset(undefined)}
      asset={asset}
      order={order}
      subOrder={subOrderDetail}
      focusedNoteIndex={null}
    />

    <SubOrderCancelModal
      isOpen={Boolean(cancelSubOrder)}
      onClose={() => setCancelSubOrder(undefined)}
      subOrder={cancelSubOrder}
      orderId={order.id}
      orderNumber={order.order_number}
      currency={order.currency}
      onConfirm={onConfirmCancel}
      isLoading={isCancelling}
    />
  </>
);

export default OrderInfoTableDrawers;
