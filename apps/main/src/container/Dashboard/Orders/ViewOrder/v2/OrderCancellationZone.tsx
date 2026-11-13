"use client";

import { useState } from "react";
import { scopeSubject } from "@/utils/order-cancellation";
import { IOrder } from "@/types/orders";
import { CancelOrderModal } from "./cancel/CancelOrderModal";
import { CancellationDeclinedBanner } from "./cancel/CancellationDeclinedBanner";
import { CancellationRequestedPanel } from "./cancel/CancellationRequestedPanel";
import { CancelledOrderBanner } from "./cancel/CancelledOrderBanner";
import { WithdrawRequestModal } from "./cancel/WithdrawRequestModal";
import type { OrderCancellationState } from "./cancel/useOrderCancellation";

interface Props {
  cancellation: OrderCancellationState;
  order: IOrder;
  companyId?: string;
}

export function OrderCancellationZone({
  cancellation,
  order,
  companyId,
}: Props) {
  const totals = {
    subOrders: cancellation.employees.length,
    items: cancellation.totalItems,
  };
  const [withdrawing, setWithdrawing] = useState(false);

  return (
    <>
      {cancellation.view === "requested" && cancellation.info && (
        <CancellationRequestedPanel
          info={cancellation.info}
          totals={totals}
          onWithdraw={() => setWithdrawing(true)}
        />
      )}
      {cancellation.view === "cancelled" && (
        <CancelledOrderBanner
          order={order}
          info={cancellation.info}
          employees={cancellation.employees}
          totals={totals}
        />
      )}
      {cancellation.view === "declined" && cancellation.info && (
        <CancellationDeclinedBanner info={cancellation.info} />
      )}
      {cancellation.info && (
        <WithdrawRequestModal
          isOpen={withdrawing}
          subject={scopeSubject(cancellation.info.scope)}
          onClose={() => setWithdrawing(false)}
          onConfirm={async () => {
            await cancellation.withdrawCancellation();
            setWithdrawing(false);
          }}
          isLoading={cancellation.isWithdrawing}
        />
      )}
      {cancellation.intent && (
        <CancelOrderModal
          order={order}
          companyId={companyId}
          intent={cancellation.intent}
          employees={cancellation.employees}
          isPreAccept={cancellation.isPreAccept}
          onClose={cancellation.closeCancelModal}
          onSubmit={cancellation.submitCancellation}
          isSubmitting={cancellation.isSubmitting}
        />
      )}
    </>
  );
}

export default OrderCancellationZone;
