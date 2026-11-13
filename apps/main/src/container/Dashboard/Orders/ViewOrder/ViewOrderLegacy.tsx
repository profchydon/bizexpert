import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavigateButton from "@/components/NavigateButton";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import routes from "@/routes";
import LeftSection from "./LeftSection";
import OrderInformation from "./OrderInformation";
import { OrderCancellationZone } from "./v2/OrderCancellationZone";
import { ViewOrderController } from "./useViewOrderController";

const ViewOrderLegacy: React.FC<{ controller: ViewOrderController }> = ({
  controller,
}) => {
  const router = useRouter();
  const {
    order,
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
    companyId,
  } = controller;

  return (
    <div className="flex flex-col py-8">
      <PageHeader
        breadCrumbs={
          transactionId
            ? [
                <Link key="transactions" href={routes.TRANSACTIONS}>
                  Transactions report
                </Link>,
                <Link
                  key="transaction-detail"
                  href={routes.TRANSACTION_DETAIL(transactionId)}
                >
                  Transaction details
                </Link>,
                order?.order_number,
              ]
            : [
                <Link key="orders" href={routes.ORDERS}>
                  Orders
                </Link>,
                order?.order_number,
              ]
        }
        pageTitle={order?.order_number}
        pageDescription="View detailed information for this order"
        onBack={() => router.back()}
      >
        {resolvedTransactionId ? (
          <NavigateButton
            href={routes.TRANSACTION_DETAIL(String(resolvedTransactionId))}
            variant="outline"
            data-testid="vieworderlegacy-button"
          >
            View transaction
          </NavigateButton>
        ) : null}
      </PageHeader>

      {order && (
        <OrderCancellationZone
          order={order}
          companyId={companyId}
          cancellation={cancel}
        />
      )}

      {order && (
        <div className="lg:grid lg:grid-cols-[25%_1fr] gap-6 mt-6 flex flex-col lg:flex-row">
          <Card className="py-6 pb-0">
            <CardContent>
              <LeftSection
                order={order}
                showCancelButton={cancel.canCancel}
                onCancelClick={() => cancel.openCancelModal()}
              />
            </CardContent>
          </Card>

          <div className="w-full max-w-full overflow-auto">
            <OrderInformation
              order={order}
              canUpdateSignature={canUpdateSignature}
              selectedExternalRows={selectedExternalRows}
              selectedRows={selectedRows}
              onSelectedRowsChange={setSelectedRows}
              onMakeSignatureRequired={enable.handleMakeSignatureRequired}
              onRemoveSignatureRequired={remove.handleRemoveSignatureRequired}
              pendingVerificationCount={pendingVerificationCount}
              onVerifyAddress={verify.handleOpenVerifyAddress}
              onVerifyAllPending={verify.handleOpenVerifyAllPending}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrderLegacy;
