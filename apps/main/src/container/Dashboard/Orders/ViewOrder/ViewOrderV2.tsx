import React, { useEffect, useRef, useState } from "react";
import { ViewOrderController } from "./useViewOrderController";
import OrderDetailHeaderV2 from "./v2/OrderDetailHeaderV2";
import OrderSidebarV2 from "./v2/OrderSidebarV2";
import OrderDetailTabsV2 from "./v2/OrderDetailTabsV2";
import OrderCancellationZone from "./v2/OrderCancellationZone";

const ViewOrderV2: React.FC<{ controller: ViewOrderController }> = ({
  controller,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarHeight, setSidebarHeight] = useState<number>();

  useEffect(() => {
    const el = sidebarRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) =>
      setSidebarHeight(entry.contentRect.height),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const {
    order,
    companyId,
    transactionId,
    resolvedTransactionId,
    canUpdateSignature,
    selectedExternalRows,
    selectedRows,
    setSelectedRows,
    pendingVerificationCount,
    enable,
    remove,
    cancel,
    verify,
  } = controller;

  if (!order) return null;

  return (
    <div className="flex flex-col gap-6 pt-8 pb-12 sm:pt-12 sm:pb-24">
      <OrderDetailHeaderV2
        order={order}
        transactionId={transactionId}
        resolvedTransactionId={resolvedTransactionId}
      />

      <OrderCancellationZone
        order={order}
        companyId={companyId}
        cancellation={cancel}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        <div ref={sidebarRef} className="w-full self-start lg:w-64">
          <OrderSidebarV2
            order={order}
            showCancelButton={cancel.canCancel}
            cancelLabel={cancel.isPreAccept ? "Cancel order" : "Request cancel"}
            unavailableMessage={cancel.cutoffMessage}
            onCancelClick={() => cancel.openCancelModal()}
          />
        </div>

        <OrderDetailTabsV2
          order={order}
          orderCompanyId={companyId}
          canUpdateSignature={canUpdateSignature}
          selectedExternalRows={selectedExternalRows}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          onMakeSignatureRequired={enable.handleMakeSignatureRequired}
          onRemoveSignatureRequired={remove.handleRemoveSignatureRequired}
          pendingVerificationCount={pendingVerificationCount}
          onVerifyAddress={verify.handleOpenVerifyAddress}
          onVerifyAllPending={verify.handleOpenVerifyAllPending}
          onBulkCancel={(suborderIds) =>
            cancel.openCancelModal({ suborderIds })
          }
          onCancelSubOrder={(subOrder) =>
            cancel.openCancelModal({ suborderIds: [subOrder.id] })
          }
          chatHeight={sidebarHeight}
        />
      </div>
    </div>
  );
};

export default ViewOrderV2;
