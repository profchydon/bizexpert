import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ISubOrder } from "@/types/orders";
import useOrderData from "./useOrderData";
import useSignatureEnable from "./useSignatureEnable";
import useSignatureRemove from "./useSignatureRemove";
import useVerifyAddressActions from "./useVerifyAddressActions";
import { useOrderCancellation } from "./v2/cancel/useOrderCancellation";
import { useClearCartAfterCheckout } from "@/hooks/useClearCartAfterCheckout";

const useViewOrderController = () => {
  const param = useParams();
  const searchParams = useSearchParams();
  const orderId = param?.orderId as string;

  const transactionId = searchParams?.get("transaction_id");
  const signatureRequestedParam = searchParams?.get("signature_requested");
  const isSignatureRequestedInUrl = signatureRequestedParam === "true";
  const isSignatureNotRequestedInUrl = signatureRequestedParam === "false";

  const [selectedExternalRows, setSelectedExternalRows] = useState<
    Record<string, boolean>
  >({});
  const [selectedRows, setSelectedRows] = useState<ISubOrder[]>([]);

  const data = useOrderData({ orderId });
  const {
    companyId,
    order,
    subOrders,
    pendingVerificationSubOrders,
    isOrderStatusLocked,
    canUpdateSignature,
    isLoading,
    isError,
    refetch,
  } = data;

  const resolvedTransactionId = transactionId || order?.transaction_id;

  useClearCartAfterCheckout({
    enabled: Boolean(order) && !isLoading,
    transactionId: resolvedTransactionId,
  });

  const enable = useSignatureEnable({
    companyId,
    orderId,
    order,
    subOrders,
    selectedRows,
    isOrderStatusLocked,
    isSignatureNotRequestedInUrl,
    refetch,
    setSelectedExternalRows,
    setSelectedRows,
  });

  const remove = useSignatureRemove({
    companyId,
    orderId,
    order,
    subOrders,
    selectedRows,
    isOrderStatusLocked,
    isSignatureRequestedInUrl,
    refetch,
    setSelectedExternalRows,
    setSelectedRows,
  });

  const cancel = useOrderCancellation({
    companyId,
    order,
    onSuccess: refetch,
  });

  const verify = useVerifyAddressActions({
    companyId,
    orderId,
    subOrders,
    pendingVerificationSubOrders,
    selectedRows,
    setSelectedExternalRows,
    setSelectedRows,
    refetch: () => {
      refetch();
    },
  });

  return {
    order,
    companyId,
    isLoading,
    isError,
    transactionId,
    resolvedTransactionId,
    canUpdateSignature,
    selectedExternalRows,
    selectedRows,
    setSelectedRows,
    pendingVerificationCount: pendingVerificationSubOrders.length,
    enable,
    remove,
    cancel,
    verify,
  };
};

export type ViewOrderController = ReturnType<typeof useViewOrderController>;

export default useViewOrderController;
