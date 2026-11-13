"use client";

import { useEffect } from "react";
import { IOrder } from "@/types/orders";
import OrderCancellationZone from "./ViewOrder/v2/OrderCancellationZone";
import { useOrderCancellation } from "./ViewOrder/v2/cancel/useOrderCancellation";

interface Props {
  order: IOrder | null;
  companyId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ListOrderCancelHost({
  order,
  companyId,
  isOpen,
  onClose,
}: Props) {
  const cancellation = useOrderCancellation({
    companyId,
    order: order ?? undefined,
    onModalClose: onClose,
  });

  useEffect(() => {
    if (isOpen && order) {
      cancellation.openCancelModal({ type: "order" });
      return;
    }
    cancellation.closeCancelModal();
  }, [
    isOpen,
    order?.id,
    cancellation.openCancelModal,
    cancellation.closeCancelModal,
  ]);

  if (!order) return null;

  return (
    <OrderCancellationZone
      cancellation={cancellation}
      order={order}
      companyId={companyId}
    />
  );
}
