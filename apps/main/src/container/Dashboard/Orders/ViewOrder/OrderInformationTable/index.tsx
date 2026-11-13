import React, { useMemo, useRef, useState, useEffect } from "react";

import OrderInformationTableColumn from "./tableColumns";
import OrderInformationTableActions from "./tableActions";
import OrderInformationTableHeader from "./OrderInformationTableHeader";
import { DataTable } from "@/components/ui/data-table";
import { referenceTableShellClass } from "@/components/application/table/reference-table-classes";
import { IOrder, ISubOrder } from "@/types/orders";
import { IAsset } from "@/types/assets";
import IndividualEmployee from "@/components/Drawers/IndividualEmployee";
import ReferenceOrderItemSlideout from "@/components/Drawers/OrderDetailItem/ReferenceOrderItemSlideout";
import SubOrderCancelModal from "./SubOrderCancelModal";
import { OrderFlowType } from "@/types/offboarding";
import routes from "@/routes";
import { useRouter, useSearchParams } from "next/navigation";
import displayCancellationSuccess from "@/utils/displayCancellationSuccess";
import { useCancelSubOrderMutation } from "@/api/baseQueries/companiesApi/ordersApi/cancelSubOrder";
import { useOrderScopedCompanyId } from "@/hooks/useOrderScopedCompanyId";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { hasVerifiableAssetOrder } from "../verificationUtils";
import { normalizeNoteIndex } from "../normalizeNoteIndex";

interface Props {
  order: IOrder;
  canUpdateSignature?: boolean;
  selectedExternalRows: Record<string, boolean>;
  selectedRows: ISubOrder[];
  onSelectedRowsChange: (rows: ISubOrder[]) => void;
  onMakeSignatureRequired?: () => void;
  onRemoveSignatureRequired?: () => void;
  pendingVerificationCount?: number;
  onVerifyAddress?: (item: ISubOrder) => void;
  onVerifyAllPending?: () => void;
}

const OrderInformationTable: React.FC<Props> = ({
  order,
  canUpdateSignature,
  selectedExternalRows,
  selectedRows,
  onSelectedRowsChange,
  onMakeSignatureRequired,
  onRemoveSignatureRequired,
  pendingVerificationCount = 0,
  onVerifyAddress,
  onVerifyAllPending,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signatureRequestedParam = searchParams?.get("signature_requested");
  const deepLinkTab = searchParams?.get("tab");
  const deepLinkSubOrderId = searchParams?.get("suborder_id");
  const deepLinkNoteIndexParam = searchParams?.get("noteIndex");
  const isSignatureRequestedInUrl = signatureRequestedParam === "true";
  const isSignatureNotRequestedInUrl = signatureRequestedParam === "false";

  const NON_UPDATABLE_SIGNATURE_STATUSES = new Set<string>([
    "completed",
    "awaiting",
    "delivered",
    "order_delivered",
    "collection_completed",
    "picked_up",
    "sold",
    "in_storage",
  ]);
  const isOrderStatusLocked = NON_UPDATABLE_SIGNATURE_STATUSES.has(
    order?.status?.toLowerCase() || "",
  );

  const companyId = useOrderScopedCompanyId(order);
  // @ts-ignore
  const orders = Array.isArray(order.sub_orders)
    ? order.sub_orders
    : // @ts-ignore
      order.sub_orders?.data;
  const [subOrderDetail, setSubOrderDetail] = useState<ISubOrder>();
  const [assetDrawerSubOrder, setAssetDrawerSubOrder] = useState<ISubOrder>();
  const [focusedNoteIndex, setFocusedNoteIndex] = useState<number | null>(null);
  const hasHandledDeepLinkRef = useRef(false);

  const [asset, setAsset] = useState<IAsset>();

  const employeeCount = useMemo(() => {
    if (order?.type === "onboarding") {
      return orders?.length || 0;
    }
    return null;
  }, [orders, order?.type]);

  const [cancelSubOrder, setCancelSubOrder] = useState<ISubOrder>();
  const [cancelSubOrderMutation, { isLoading: isCancelling }] =
    useCancelSubOrderMutation();
  const [signatureFilterMode, setSignatureFilterMode] = useState<
    "required" | "not_required" | null
  >(null);
  const isOffboardingOrder = order?.type === "offboarding";
  const allStorageRows =
    isOffboardingOrder &&
    (orders || []).length > 0 &&
    (orders || []).every((row: ISubOrder) => row?.type === "storage");

  const handleRequestCancel = (item: ISubOrder) => {
    setCancelSubOrder(item);
  };

  const handleRowSelectionChange = (rows: ISubOrder[]) => {
    if (rows.length === 0) {
      setSignatureFilterMode(null);
      onSelectedRowsChange([]);
      return;
    }

    // Determine the signature mode from the first selected row
    if (signatureFilterMode === null && rows.length > 0) {
      const firstRow = rows[0];
      const isSignatureRequested =
        firstRow?.type === "reassign" || order?.type === "storage_to_employee"
          ? firstRow.signature_requested
          : (firstRow?.assets?.[0] as any)?.signature_requested;

      setSignatureFilterMode(
        isSignatureRequested ? "required" : "not_required",
      );
    }

    onSelectedRowsChange(rows);
  };

  // Determine button visibility based on URL params or existing logic
  const showMakeSignatureButton = isSignatureNotRequestedInUrl
    ? !allStorageRows
    : selectedRows.length > 0 && signatureFilterMode === "not_required";
  const isStorageSelectionBlocked =
    isOffboardingOrder &&
    (allStorageRows ||
      (selectedRows.length > 0 &&
        selectedRows.every((row) => row?.type === "storage")));
  const showRemoveSignatureButton = isSignatureRequestedInUrl
    ? true
    : selectedRows.length > 0 && signatureFilterMode === "required";

  const selectedVerificationPendingRows = selectedRows.filter(
    (row) =>
      row?.status?.toLowerCase() === "verification_pending" &&
      hasVerifiableAssetOrder(row),
  );
  const hasVerificationPendingRows = pendingVerificationCount > 0;

  // Hide column select when signature_requested param is set or for buy_to_storage orders
  const hideColumnSelect =
    isSignatureRequestedInUrl ||
    isSignatureNotRequestedInUrl ||
    order?.type === "buy_to_storage" ||
    allStorageRows ||
    isOrderStatusLocked;

  const handleConfirmCancel = async (
    reason: string,
    additionalDetails: string,
  ) => {
    try {
      await cancelSubOrderMutation({
        companyId,
        orderId: order?.id,
        subOrderId: cancelSubOrder?.id,
        reason,
        additional_details: additionalDetails,
      }).unwrap();
      setCancelSubOrder(undefined);
      displayCancellationSuccess();
    } catch (error: any) {
      displayErrorMessage(
        "Failed to cancel sub-order",
        error?.data?.message || "Something went wrong. Please try again.",
      );
    }
  };

  const opensSubOrderDrawer = (type?: string) =>
    type === "offboarding" ||
    type === "storage_to_employee" ||
    type === "onboarding" ||
    type === "device_refresh" ||
    type === "buy_to_storage";

  const columns: any = useMemo(
    () =>
      OrderInformationTableColumn(
        (item: ISubOrder) => (
          <OrderInformationTableActions
            item={item}
            orderType={order?.type}
            orderStatus={order?.status}
            onView={
              opensSubOrderDrawer(order?.type)
                ? () => {
                    setAssetDrawerSubOrder(undefined);
                    setFocusedNoteIndex(null);
                    setSubOrderDetail(item);
                  }
                : undefined
            }
            viewHref={
              opensSubOrderDrawer(order?.type) || !item.equipment?.id
                ? undefined
                : `${routes.All_Equipments}/${item.equipment.id}`
            }
            onRequestCancel={() => handleRequestCancel(item)}
            onVerifyAddress={
              item?.status?.toLowerCase() === "verification_pending" &&
              onVerifyAddress
                ? () => onVerifyAddress(item)
                : undefined
            }
            isVerifyAddressDisabled={
              item?.status?.toLowerCase() === "verification_pending" &&
              !hasVerifiableAssetOrder(item)
            }
          />
        ),
        order?.type!,
        order?.currency!,
        signatureFilterMode,
        hideColumnSelect,
        (row: ISubOrder) => {
          if (isOrderStatusLocked) return false;
          const statusLower = row?.status?.toLowerCase() || "";
          return (
            row?.type !== "storage" &&
            !NON_UPDATABLE_SIGNATURE_STATUSES.has(statusLower)
          );
        },
      ),
    [
      order?.type,
      order?.currency,
      router,
      signatureFilterMode,
      hideColumnSelect,
      isOrderStatusLocked,
    ],
  );

  useEffect(() => {
    if (hasHandledDeepLinkRef.current) return;
    if (deepLinkTab !== "notes" || !deepLinkSubOrderId) return;
    if (!Array.isArray(orders) || orders.length === 0) return;

    const matchedSubOrder = (orders as ISubOrder[]).find(
      (item) => item?.id === deepLinkSubOrderId,
    );

    hasHandledDeepLinkRef.current = true;
    if (!matchedSubOrder) return;

    const notesLength = ((matchedSubOrder as any)?.note || []).length;
    setFocusedNoteIndex(
      normalizeNoteIndex(deepLinkNoteIndexParam, notesLength),
    );

    if (
      order?.type === "onboarding" &&
      Array.isArray((matchedSubOrder as any)?.assets) &&
      (matchedSubOrder as any).assets.length > 0
    ) {
      setSubOrderDetail(undefined);
      setAssetDrawerSubOrder(matchedSubOrder);
      setAsset((matchedSubOrder as any).assets[0]);
      return;
    }

    setSubOrderDetail(matchedSubOrder);
  }, [deepLinkTab, deepLinkSubOrderId, deepLinkNoteIndexParam, orders]);

  return (
    <>
      <div
        className={`${referenceTableShellClass} flex min-w-0 flex-col ring-1 ring-gray-200 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-gray-200 relative`}
      >
        <OrderInformationTableHeader
          employeeCount={employeeCount}
          canUpdateSignature={canUpdateSignature}
          showMakeSignatureButton={showMakeSignatureButton}
          showRemoveSignatureButton={showRemoveSignatureButton}
          isStorageSelectionBlocked={isStorageSelectionBlocked}
          hasVerificationPendingRows={hasVerificationPendingRows}
          selectedVerificationPendingCount={
            selectedVerificationPendingRows.length
          }
          onMakeSignatureRequired={onMakeSignatureRequired}
          onRemoveSignatureRequired={onRemoveSignatureRequired}
          onVerifyAllPending={onVerifyAllPending}
        />
        <div className="min-w-0 overflow-x-auto pb-2">
          <DataTable
            data={orders}
            columns={columns}
            externalRowSelection={selectedExternalRows}
            setSeletectedValue={handleRowSelectionChange}
          />
        </div>
      </div>

      <IndividualEmployee
        isOpen={Boolean(subOrderDetail)}
        onClose={() => {
          setSubOrderDetail(undefined);
          setAssetDrawerSubOrder(undefined);
          setFocusedNoteIndex(null);
        }}
        onOpen={(subOrder) => setSubOrderDetail(subOrder)}
        subOrderDetail={subOrderDetail}
        order={order}
        onSave={() => null}
        onView={(asset) => setAsset(asset)}
        actionType={order?.type! as any as OrderFlowType}
        focusedNoteIndex={focusedNoteIndex}
      />

      <ReferenceOrderItemSlideout
        isOpen={Boolean(asset)}
        onClose={() => {
          setAsset(undefined);
          setAssetDrawerSubOrder(undefined);
          setFocusedNoteIndex(null);
        }}
        asset={asset}
        order={order}
        subOrder={subOrderDetail || assetDrawerSubOrder}
        focusedNoteIndex={focusedNoteIndex}
      />

      <SubOrderCancelModal
        isOpen={Boolean(cancelSubOrder)}
        onClose={() => setCancelSubOrder(undefined)}
        subOrder={cancelSubOrder}
        orderId={order.id}
        orderNumber={order.order_number}
        currency={order.currency}
        onConfirm={handleConfirmCancel}
        isLoading={isCancelling}
      />
    </>
  );
};

export default OrderInformationTable;
