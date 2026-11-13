import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useRemoveOrderSignatureMutation,
  useRemoveSubOrderSignatureMutation,
} from "@/api/baseQueries/companiesApi/ordersApi/updateOrderSignature";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { IOrder, ISubOrder } from "@/types/orders";
import {
  RemoveDeps,
  removeSignatureAtOrderLevel,
  removeSignatureForRows,
} from "./performSignatureRemove";

interface Params {
  companyId?: string;
  orderId: string;
  order?: IOrder;
  subOrders: ISubOrder[];
  selectedRows: ISubOrder[];
  isOrderStatusLocked: boolean;
  isSignatureRequestedInUrl: boolean;
  refetch: () => void;
  setSelectedExternalRows: Dispatch<SetStateAction<Record<string, boolean>>>;
  setSelectedRows: Dispatch<SetStateAction<ISubOrder[]>>;
}

const useSignatureRemove = (params: Params) => {
  const {
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
  } = params;
  const router = useRouter();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [isRemoveLoading, setIsRemoveLoading] = useState(false);

  const [removeOrderSignature] = useRemoveOrderSignatureMutation();
  const [removeSubOrderSignature] = useRemoveSubOrderSignatureMutation();

  const handleRemoveSignatureRequired = useCallback(() => {
    if (isOrderStatusLocked) {
      displayErrorMessage(
        "Signature requirement cannot be updated for this order status.",
      );
      return;
    }
    if (isSignatureRequestedInUrl) {
      setShowRemoveDialog(true);
      return;
    }
    if (selectedRows.length === 0) return;
    setShowRemoveDialog(true);
  }, [isOrderStatusLocked, isSignatureRequestedInUrl, selectedRows]);

  const handleConfirmRemove = useCallback(async () => {
    if (!companyId || !orderId) return;
    if (isOrderStatusLocked) {
      displayErrorMessage(
        "Signature requirement cannot be updated for this order status.",
      );
      setShowRemoveDialog(false);
      return;
    }

    const deps: RemoveDeps = {
      companyId,
      orderId,
      order,
      subOrders,
      refetch,
      router,
      resetSelection: () => {
        setSelectedExternalRows({});
        setSelectedRows([]);
      },
      closeDialog: () => setShowRemoveDialog(false),
    };

    setIsRemoveLoading(true);
    try {
      if (isSignatureRequestedInUrl) {
        await removeSignatureAtOrderLevel(removeOrderSignature, deps);
        return;
      }
      if (selectedRows.length === 0) return;
      await removeSignatureForRows(removeSubOrderSignature, selectedRows, deps);
    } catch (error: any) {
      displayErrorMessage(
        error?.data?.message || "Failed to remove signature requirement",
      );
    } finally {
      setIsRemoveLoading(false);
    }
  }, [
    companyId,
    isOrderStatusLocked,
    isSignatureRequestedInUrl,
    order,
    orderId,
    refetch,
    removeOrderSignature,
    removeSubOrderSignature,
    router,
    selectedRows,
    setSelectedExternalRows,
    setSelectedRows,
    subOrders,
  ]);

  return {
    showRemoveDialog,
    setShowRemoveDialog,
    isRemoveLoading,
    handleRemoveSignatureRequired,
    handleConfirmRemove,
  };
};

export default useSignatureRemove;
