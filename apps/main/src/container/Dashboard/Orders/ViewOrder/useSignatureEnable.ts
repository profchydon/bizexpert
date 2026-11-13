import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useAddOrderSignatureMutation,
  useAddSubOrderSignatureMutation,
} from "@/api/baseQueries/companiesApi/ordersApi/updateOrderSignature";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { IOrder, ISubOrder } from "@/types/orders";
import {
  ConfirmDialogData,
  buildConfirmDialogData,
} from "./orderSignatureRules";
import {
  EnableDeps,
  enableSignatureAtOrderLevel,
  enableSignatureForRows,
} from "./performSignatureEnable";

interface Params {
  companyId?: string;
  orderId: string;
  order?: IOrder;
  subOrders: ISubOrder[];
  selectedRows: ISubOrder[];
  isOrderStatusLocked: boolean;
  isSignatureNotRequestedInUrl: boolean;
  refetch: () => void;
  setSelectedExternalRows: Dispatch<SetStateAction<Record<string, boolean>>>;
  setSelectedRows: Dispatch<SetStateAction<ISubOrder[]>>;
}

const EMPTY_DIALOG: ConfirmDialogData = {
  failedSubOrders: [],
  successSubOrders: [],
  updatedCount: 0,
  totalCount: 0,
};

const useSignatureEnable = (params: Params) => {
  const {
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
  } = params;
  const router = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogData, setConfirmDialogData] =
    useState<ConfirmDialogData>(EMPTY_DIALOG);

  const [addSubOrderSignature, { isLoading: isAdding }] =
    useAddSubOrderSignatureMutation();
  const [addOrderSignature, { isLoading: isAddingEmployeeSignature }] =
    useAddOrderSignatureMutation();

  const hasStorageSubOrders =
    order?.type === "offboarding" &&
    subOrders.some((sub) => sub?.type === "storage");

  const handleMakeSignatureRequired = useCallback(() => {
    if (isOrderStatusLocked) {
      displayErrorMessage(
        "Signature requirement cannot be updated for this order status.",
      );
      return;
    }
    if (isSignatureNotRequestedInUrl) {
      if (hasStorageSubOrders) {
        displayErrorMessage(
          "Signature requirement cannot be enabled for storage offboarding actions.",
        );
        return;
      }
      setConfirmDialogData(buildConfirmDialogData(subOrders, order));
      setShowConfirmDialog(true);
      return;
    }
    if (!companyId || !orderId || selectedRows.length === 0) return;
    const eligibleRows = selectedRows.filter((row) => row?.type !== "storage");
    if (eligibleRows.length === 0) {
      displayErrorMessage(
        "Signature requirement cannot be enabled for storage offboarding actions.",
      );
      return;
    }
    setConfirmDialogData(buildConfirmDialogData(eligibleRows, order));
    setShowConfirmDialog(true);
  }, [
    companyId,
    hasStorageSubOrders,
    isOrderStatusLocked,
    isSignatureNotRequestedInUrl,
    order,
    orderId,
    selectedRows,
    subOrders,
  ]);

  const handleConfirmUpdate = useCallback(async () => {
    if (!companyId || !orderId) return;
    if (isOrderStatusLocked) {
      displayErrorMessage(
        "Signature requirement cannot be updated for this order status.",
      );
      setShowConfirmDialog(false);
      return;
    }

    const deps: EnableDeps = {
      companyId,
      orderId,
      refetch,
      router,
      resetSelection: () => {
        setSelectedExternalRows({});
        setSelectedRows([]);
      },
      closeDialog: () => setShowConfirmDialog(false),
    };

    if (isSignatureNotRequestedInUrl) {
      await enableSignatureAtOrderLevel(addOrderSignature, deps);
      return;
    }
    if (selectedRows.length === 0) return;
    await enableSignatureForRows(addSubOrderSignature, selectedRows, deps);
  }, [
    addOrderSignature,
    addSubOrderSignature,
    companyId,
    isOrderStatusLocked,
    isSignatureNotRequestedInUrl,
    orderId,
    refetch,
    router,
    selectedRows,
    setSelectedExternalRows,
    setSelectedRows,
  ]);

  return {
    showConfirmDialog,
    setShowConfirmDialog,
    confirmDialogData,
    handleMakeSignatureRequired,
    handleConfirmUpdate,
    isAdding,
    isAddingEmployeeSignature,
  };
};

export default useSignatureEnable;
