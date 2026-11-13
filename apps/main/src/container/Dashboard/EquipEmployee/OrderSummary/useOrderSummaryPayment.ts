"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { useBuyToStoragePaymentMutation } from "@/api/baseQueries/companiesApi/transactionsApi/buyToStoragePayment";
import { useStorageActionsPaymentMutation } from "@/api/baseQueries/companiesApi/transactionsApi/storageActionsPayment";
import { useApproveCatalogPolicyOrderRequestMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/approveCatalogPolicyOrderRequest";
import { useOnboardingPaymentMutation } from "@/api/baseQueries/companiesApi/transactionsApi/onboardingPayment";
import {
  useEquipEmployeePaymentMutation,
  type EquipEmployeeInitiateReq,
} from "@/api/baseQueries/companiesApi/transactionsApi/equipEmployeePayment";
import { usePaymentRedirect } from "@/components/Drawers/PaymentMethods/usePaymentRedirect";
import useCart from "@/hooks/useCart";
import {
  approvalPaymentLink,
  approvalPaymentPayload,
  approvalRedirectUrl,
  type ApprovalPaymentRequest,
} from "./approvalPayment";
import type { BuildInitiateArgs } from "./useEquipEmployeeCheckout";
import { buildStorageActionsInitiatePayload } from "./buildStorageActionsInitiatePayload";
import type { StorageActionFeeOrder } from "@/api/baseQueries/feesApi/storageActionFeeOrders";
import { paymentRedirectProperties } from "@/lib/paymentAnalytics";
import {
  extractOrderIdFromResponse,
  trackOrderSubmitted,
  uniqueStorageActionKind,
  type OrderFlow,
} from "@/lib/orderFlowAnalytics";

type EquipEmployeeCheckout = {
  build: (args: BuildInitiateArgs) => EquipEmployeeInitiateReq | undefined;
  onSuccess?: () => void;
};

type UseOrderSummaryPaymentArgs = {
  additionalEmails: string[];
  approvalPaymentRequest?: ApprovalPaymentRequest | null;
  companyId?: string;
  equipEmployeeCheckout?: EquipEmployeeCheckout | null;
  isSignatureRequired: boolean;
  isStorageActionsFlow?: boolean;
  isStorageOnlyFlow: boolean;
  note: string;
  payload: unknown;
  setTabState: Dispatch<SetStateAction<"Card" | "Credit">>;
  storageActionsCountryId?: string;
  storageActionsOrders?: StorageActionFeeOrder[];
  submitAnalytics?: {
    itemCount: number;
    totalValue: number;
  };
  tabState: "Card" | "Credit";
};

export function useOrderSummaryPayment({
  additionalEmails,
  approvalPaymentRequest,
  companyId,
  equipEmployeeCheckout,
  isSignatureRequired,
  isStorageActionsFlow = false,
  isStorageOnlyFlow,
  note,
  payload,
  setTabState,
  storageActionsCountryId,
  storageActionsOrders = [],
  submitAnalytics,
  tabState,
}: UseOrderSummaryPaymentArgs) {
  const [redirectUrl, setRedirectUrl] = useState("");
  const [isPaymentmethodOpen, setIsPaymentmethodOpen] = useState(false);
  const [selectedCardValue, setSelectedCardValue] = useState<string>();
  const { beginRedirect, isRedirecting } = usePaymentRedirect({
    selectedCardValue,
    setIsPaymentmethodOpen,
    setSelectedCardValue,
    setTabState,
    tabState,
  });
  const [approveRequest, approveRequestProps] =
    useApproveCatalogPolicyOrderRequestMutation();
  const [onBoardPayment, onBoardPaymentProps] = useOnboardingPaymentMutation();
  const [buyToStoragePayment, buyToStoragePaymentProps] =
    useBuyToStoragePaymentMutation();
  const [storageActionsPayment, storageActionsPaymentProps] =
    useStorageActionsPaymentMutation();
  const [equipEmployeePayment, equipEmployeePaymentProps] =
    useEquipEmployeePaymentMutation();
  const { removeAllItemsFromCart } = useCart();

  const redirectAfterCheckout = async (
    link: string,
    analytics?: ReturnType<typeof paymentRedirectProperties>,
  ) => {
    await removeAllItemsFromCart();
    beginRedirect(link, analytics);
  };

  useEffect(() => {
    setRedirectUrl(`${globalThis.location.origin}/dashboard/transactions`);
  }, []);

  const emitOrderSubmitted = (
    orderFlow: OrderFlow,
    response: unknown,
    fallbackOrderId = "",
  ) => {
    const orderId = extractOrderIdFromResponse(response, fallbackOrderId);
    const actionKind =
      orderFlow === "storage-actions"
        ? uniqueStorageActionKind(
            storageActionsOrders.map((order) => order.type),
          )
        : undefined;
    trackOrderSubmitted({
      order_flow: orderFlow,
      order_id: orderId,
      item_count: submitAnalytics?.itemCount ?? 0,
      total_value: submitAnalytics?.totalValue ?? 0,
      payment_method: tabState,
      ...(actionKind ? { action_kind: actionKind } : {}),
    });
    return orderId;
  };

  const handleConfirm = async () => {
    if (equipEmployeeCheckout && companyId) {
      const equipPayload = equipEmployeeCheckout.build({
        redirectUrl,
        paymentMethod: tabState,
      });
      if (!equipPayload) return;
      const res = await equipEmployeePayment({
        companyId,
        payload: equipPayload,
      }).unwrap();
      const orderId = emitOrderSubmitted("equip_employee", res);
      equipEmployeeCheckout.onSuccess?.();
      await redirectAfterCheckout(
        res.data.link,
        paymentRedirectProperties("equip_employee", orderId),
      );
      return;
    }
    if (approvalPaymentRequest && companyId) {
      const redirectUrl = approvalRedirectUrl({
        catalogId: approvalPaymentRequest.catalogId,
        origin: globalThis.location.origin,
        orderRequestId: approvalPaymentRequest.orderRequestId,
        returnPath: approvalPaymentRequest.returnPath,
      });
      const res = await approveRequest({
        catalogId: approvalPaymentRequest.catalogId,
        companyId,
        orderRequestId: approvalPaymentRequest.orderRequestId,
        payload: approvalPaymentPayload({
          acknowledgeBudgetWarning:
            approvalPaymentRequest.acknowledgeBudgetWarning,
          additionalRecipients: additionalEmails,
          note,
          orderNote: note,
          paymentMethod: tabState,
          redirectUrl,
          signatureRequested: isSignatureRequired,
        }),
      }).unwrap();
      const orderId = emitOrderSubmitted(
        "approval",
        res,
        approvalPaymentRequest.orderRequestId,
      );
      const paymentLink = approvalPaymentLink(res);
      if (paymentLink) {
        await redirectAfterCheckout(
          paymentLink,
          paymentRedirectProperties("approval", orderId),
        );
      }
      return;
    }
    if (
      isStorageActionsFlow &&
      companyId &&
      storageActionsCountryId &&
      redirectUrl &&
      storageActionsOrders.length > 0
    ) {
      const payload = buildStorageActionsInitiatePayload({
        additionalRecipients: additionalEmails,
        countryId: storageActionsCountryId,
        note,
        orders: storageActionsOrders,
        paymentMethod: tabState,
        redirectUrl,
        signatureRequested: isSignatureRequired,
      });
      const res = await storageActionsPayment({
        companyId,
        ...payload,
      }).unwrap();
      const orderId = emitOrderSubmitted("storage-actions", res);
      await redirectAfterCheckout(
        res.data.link,
        paymentRedirectProperties("storage-actions", orderId),
      );
      return;
    }
    if (!payload) return;
    const data = {
      ...(payload as Record<string, unknown>),
      shipping_fee: 0,
      redirect_url: redirectUrl,
      ...(note && { order_note: note }),
      ...(additionalEmails.length > 0 && {
        additional_recipients: additionalEmails,
      }),
      payment_method: tabState,
    };
    const payment = isStorageOnlyFlow
      ? buyToStoragePayment({ companyId: companyId!, payload: data as any })
      : onBoardPayment({ companyId: companyId!, payload: data as any });
    const res = await payment.unwrap();
    const orderFlow = isStorageOnlyFlow ? "buy_to_storage" : "onboarding";
    const orderId = emitOrderSubmitted(orderFlow, res);
    await redirectAfterCheckout(
      res.data.link,
      paymentRedirectProperties(orderFlow, orderId),
    );
  };

  return {
    closePaymentmethod() {
      if (isRedirecting) return;
      setIsPaymentmethodOpen(false);
      setTabState("Credit");
    },
    handleCardSelection: setSelectedCardValue,
    handleConfirm,
    isPaymentLoading:
      isRedirecting ||
      approveRequestProps.isLoading ||
      onBoardPaymentProps.isLoading ||
      buyToStoragePaymentProps.isLoading ||
      storageActionsPaymentProps.isLoading ||
      equipEmployeePaymentProps.isLoading,
    isPaymentmethodOpen,
    selectedCardValue,
    setIsPaymentmethodOpen,
    togglePaymentmethod() {
      if (isRedirecting) return;
      setIsPaymentmethodOpen((open) => !open);
      setTabState("Card");
    },
  };
}
