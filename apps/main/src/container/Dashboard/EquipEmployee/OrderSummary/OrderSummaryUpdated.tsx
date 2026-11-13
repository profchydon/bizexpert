"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  resolveOrderSummaryFlow,
  trackOrderCancelled,
  trackOrderSummaryViewed,
} from "@/lib/orderFlowAnalytics";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useGetCatalogQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalog";
import useOnboardFeeAction from "@/hooks/useOnboardFeeAction";
import { STORAGE_ACTIONS_FLOW } from "@/app/dashboard/NavBar/useStorageActionsCheckout";
import { orderSummaryBreadcrumbs } from "./orderSummaryBreadcrumbs";
import { useApprovalOrderSummaryPreview } from "./useApprovalOrderSummaryPreview";
import { useOrderSummaryPayment } from "./useOrderSummaryPayment";
import { useEquipEmployeeCheckout } from "./useEquipEmployeeCheckout";
import { useOrderSummaryEmployees } from "./useOrderSummaryEmployees";
import { useStorageActionFees } from "./useStorageActionFees";
import { storageActionCountryNameFromItems } from "./storageActionFeeCountry";
import { OrderSummaryUpdatedView } from "./OrderSummaryUpdatedView";
import { splitCheckoutRecipients } from "../AssignmentFlow/officeCheckout";
import {
  countOrderSummaryItems,
  pickOrderSummaryFeeDisplay,
} from "./pickOrderSummaryFeeDisplay";

const OrderSummaryUpdated = () => {
  const searchParams = useSearchParams();
  const catalogId = searchParams.get("catalogId") as string;
  const isEquipEmployeeFlow = searchParams.get("flow") === "equip-employee";
  const isStorageActionsFlow =
    searchParams.get("flow") === STORAGE_ACTIONS_FLOW;
  const companyId = useWorkspaceCompanyId();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const [note, setNote] = useState("");
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [isSignatureRequired, setIsSignatureRequired] = useState(false);
  const [tabState, setTabState] = useState<"Card" | "Credit">("Credit");
  const orderSummaryViewedRef = useRef(false);
  const { data: catalogRes } = useGetCatalogQuery(
    { catalogId, companyId: companyId! },
    { skip: !catalogId },
  );
  const {
    currentItems,
    currentPage,
    employeesWithItems,
    getEmployeeCountryId,
    goToNextPage,
    goToPreviousPage,
    hasApprovalRequest,
    isStorageOnlyFlow,
    isUnassigned,
    totalPages,
  } = useOrderSummaryEmployees();
  const approval = useApprovalOrderSummaryPreview({
    companyId: companyId,
    employeeId: String(currentItems?.[0]?.id ?? ""),
    employees: employeesWithItems,
    paymentMethod: tabState,
  });
  const skipSharedFeeQuery =
    approval.isApprovalOrderSummaryFlow ||
    hasApprovalRequest ||
    isEquipEmployeeFlow ||
    isStorageActionsFlow;
  const onboard = useOnboardFeeAction({
    employees: employeesWithItems,
    paymentMethod: tabState,
    buyToStorage: isStorageOnlyFlow,
    employeeCountry: getEmployeeCountryId(),
    isSignatureRequired,
    skipFeeQuery: skipSharedFeeQuery,
  });
  const equip = useEquipEmployeeCheckout({
    enabled: isEquipEmployeeFlow,
    companyCountryId: company?.country?.id,
    additionalEmails,
    isSignatureRequired,
    note,
    paymentMethod: tabState,
  });
  const storageActions = useStorageActionFees(
    isStorageActionsFlow,
    tabState,
    storageActionCountryNameFromItems(employeesWithItems[0]?.items ?? []),
  );
  const currentEmployeeId = String(currentItems?.[0]?.id ?? "");
  const equipEmployeeFees = isEquipEmployeeFlow
    ? (equip.getEmployeeFees(currentEmployeeId) as Record<string, unknown>)
    : undefined;
  const display = pickOrderSummaryFeeDisplay({
    isApprovalOrderSummaryFlow: approval.isApprovalOrderSummaryFlow,
    isEquipEmployeeFlow,
    isStorageActionsFlow,
    approval: {
      summary: approval.totalFeesSummary,
      rows: approval.totalFeesArray,
      totalEquipment: approval.totalEquipment,
      isLoading: approval.isApprovalPreviewLoading,
      isError: approval.isApprovalPreviewError,
    },
    equip: {
      summary: equip.totalFeesSummary,
      rows: equip.totalFeesArray,
      totalEquipment: equip.totalEquipment,
      isLoading: equip.isLoading,
      isError: equip.isError,
    },
    storageActions: {
      summary: storageActions.totalFeesSummary,
      rows: storageActions.totalFeesArray,
      totalEquipment: countOrderSummaryItems(employeesWithItems),
      isLoading: storageActions.isLoading,
      isError: storageActions.isError,
    },
    onboard: {
      summary: onboard.totalFeesSummary,
      rows: onboard.totalFeesArray,
      totalEquipment: onboard.totalEquipment,
      isLoading: onboard.isLoading,
      isError: onboard.isError,
    },
  });
  const payment = useOrderSummaryPayment({
    additionalEmails,
    approvalPaymentRequest: approval.approvalPaymentRequest,
    companyId: companyId,
    equipEmployeeCheckout: equip.checkout,
    isSignatureRequired,
    isStorageActionsFlow,
    isStorageOnlyFlow,
    note,
    payload: onboard.payload,
    setTabState,
    storageActionsCountryId: storageActions.countryId,
    storageActionsOrders: storageActions.orders,
    tabState,
    submitAnalytics: {
      itemCount: display.totalEquipment,
      totalValue: display.summary?.total_fee ?? 0,
    },
  });
  const orderOfficeIds = [
    ...new Set(
      splitCheckoutRecipients(employeesWithItems)
        .offices.map((office) => office.office_id)
        .filter((officeId): officeId is string => Boolean(officeId)),
    ),
  ];
  const signatureRequested = Boolean(
    (display.summary as { signature_requested?: boolean } | undefined)
      ?.signature_requested,
  );
  const orderFlow = resolveOrderSummaryFlow({
    isApprovalFlow: approval.isApprovalOrderSummaryFlow,
    isEquipEmployeeFlow,
    isStorageActionsFlow,
    isStorageOnlyFlow,
  });

  useEffect(() => {
    if (orderSummaryViewedRef.current) return;
    if (display.isLoading || display.isError) return;
    if (!display.totalEquipment || display.totalEquipment <= 0) return;
    if (display.summary?.total_fee == null) return;

    orderSummaryViewedRef.current = true;
    trackOrderSummaryViewed({
      order_flow: orderFlow,
      item_count: display.totalEquipment,
      total_value: display.summary.total_fee,
      currency:
        display.summary.currency?.code ??
        display.summary.currency?.symbol ??
        company?.currency_code ??
        "",
    });
  }, [
    company?.currency_code,
    display.isError,
    display.isLoading,
    display.summary,
    display.totalEquipment,
    orderFlow,
  ]);

  useEffect(() => {
    if (signatureRequested) setIsSignatureRequired(true);
  }, [signatureRequested]);

  return (
    <OrderSummaryUpdatedView
      additionalEmails={additionalEmails}
      breadCrumbs={orderSummaryBreadcrumbs({
        catalog: catalogRes?.data,
        isApprovalFlow: approval.isApprovalOrderSummaryFlow,
        isUnassigned,
      })}
      closePaymentmethod={payment.closePaymentmethod}
      currentItems={currentItems}
      currentPage={currentPage}
      display={display}
      goToNextPage={goToNextPage}
      goToPreviousPage={goToPreviousPage}
      handleCardSelection={payment.handleCardSelection}
      handleConfirm={payment.handleConfirm}
      isApprovalOrderSummaryFlow={approval.isApprovalOrderSummaryFlow}
      isPaymentLoading={payment.isPaymentLoading}
      isPaymentmethodOpen={payment.isPaymentmethodOpen}
      onBack={
        isStorageActionsFlow
          ? () =>
              trackOrderCancelled({
                order_flow: "storage-actions",
                step_abandoned: "order_summary",
              })
          : undefined
      }
      isSignatureRequired={isSignatureRequired}
      isStorageOnlyFlow={isStorageOnlyFlow}
      itemFeeSummary={
        approval.isApprovalOrderSummaryFlow
          ? approval.approvalEmployeeFees
          : equipEmployeeFees
      }
      itemFeeTotal={equipEmployeeFees?.items as number | undefined}
      note={note}
      orderOfficeIds={orderOfficeIds}
      selectedCardValue={payment.selectedCardValue}
      setAdditionalEmails={setAdditionalEmails}
      setIsSignatureRequired={setIsSignatureRequired}
      setNote={setNote}
      setTabState={setTabState}
      skipItemFeeQuery={skipSharedFeeQuery}
      tabState={tabState}
      togglePaymentmethod={payment.togglePaymentmethod}
      totalPages={totalPages}
    />
  );
};

export default OrderSummaryUpdated;
