import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useVerifyOrderAddressMutation } from "@/api/baseQueries/companiesApi/ordersApi/verifyOrderAddress";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { ISubOrder, VerificationContext } from "@/types/orders";
import {
  buildVerifyOrderSuborders,
  hasVerifiableAssetOrder,
} from "./verificationUtils";
import { VerifyModalState } from "./verificationContexts";
import { buildVerifyToast } from "./verifyAddressMessages";

interface UseVerifyAddressActionsProps {
  companyId?: string;
  orderId?: string;
  subOrders: ISubOrder[];
  pendingVerificationSubOrders: ISubOrder[];
  selectedRows: ISubOrder[];
  setSelectedExternalRows: Dispatch<SetStateAction<Record<string, boolean>>>;
  setSelectedRows: Dispatch<SetStateAction<ISubOrder[]>>;
  refetch: () => void;
}

const useVerifyAddressActions = ({
  companyId,
  orderId,
  subOrders,
  pendingVerificationSubOrders,
  selectedRows,
  setSelectedExternalRows,
  setSelectedRows,
  refetch,
}: UseVerifyAddressActionsProps) => {
  const [verifyModal, setVerifyModal] = useState<VerifyModalState>(null);

  const [verifyOrderAddress, { isLoading: isVerifyingAddress }] =
    useVerifyOrderAddressMutation();

  const handleOpenVerifyAddress = useCallback((item: ISubOrder) => {
    if (!hasVerifiableAssetOrder(item)) {
      displayErrorMessage(
        "All details in this row have already been verified.",
      );
      return;
    }

    setVerifyModal({ type: "single", subOrderId: item.id });
  }, []);

  const handleOpenVerifyAllPending = useCallback(() => {
    const selectedPendingRows = selectedRows.filter(
      (row) => row?.status?.toLowerCase() === "verification_pending",
    );
    const verifiableSelectedPendingRows = selectedPendingRows.filter(
      hasVerifiableAssetOrder,
    );

    if (selectedPendingRows.length > 0) {
      if (!verifiableSelectedPendingRows.length) {
        displayErrorMessage(
          "All selected addresses have already been verified.",
        );
        return;
      }

      setVerifyModal({
        type: "bulk",
        bulkMode: "selected",
        subOrderIds: verifiableSelectedPendingRows.map((row) => row.id),
      });
      return;
    }

    const verifiablePendingSubOrders = pendingVerificationSubOrders.filter(
      hasVerifiableAssetOrder,
    );

    if (!verifiablePendingSubOrders.length) {
      displayErrorMessage("No verification pending address found.");
      return;
    }

    setVerifyModal({
      type: "bulk",
      bulkMode: "all_pending",
      subOrderIds: verifiablePendingSubOrders.map((row: ISubOrder) => row.id),
    });
  }, [pendingVerificationSubOrders, selectedRows]);

  const verifyModalSubOrders = useMemo(() => {
    if (!verifyModal) return [];
    if (verifyModal.type === "single") {
      return subOrders.filter(
        (sub: ISubOrder) => sub.id === verifyModal.subOrderId,
      );
    }

    const selectedById = new Set(verifyModal.subOrderIds);
    return subOrders.filter((sub: ISubOrder) => selectedById.has(sub.id));
  }, [subOrders, verifyModal]);

  const handleConfirmVerifyAddress = useCallback(
    async (selectedContexts?: VerificationContext[]) => {
      if (!companyId || !orderId || !verifyModal) return;

      try {
        const suborders = buildVerifyOrderSuborders(
          verifyModalSubOrders,
          selectedContexts,
        );

        if (!suborders.length) {
          displayErrorMessage(
            "All selected details have already been verified.",
          );
          return;
        }

        await verifyOrderAddress({ companyId, orderId, suborders }).unwrap();

        setVerifyModal(null);
        setSelectedExternalRows({});
        setSelectedRows([]);

        const { title, description } = buildVerifyToast(verifyModal);
        displaySuccessMessage(title, description);
        refetch();
      } catch (error: any) {
        displayErrorMessage(
          error?.data?.message || "Failed to verify pending address",
        );
      }
    },
    [
      companyId,
      orderId,
      refetch,
      setSelectedExternalRows,
      setSelectedRows,
      verifyModal,
      verifyModalSubOrders,
      verifyOrderAddress,
    ],
  );

  const closeVerifyModal = useCallback(() => setVerifyModal(null), []);

  const handleVerifyModalOpenChange = useCallback((open: boolean) => {
    if (!open) setVerifyModal(null);
  }, []);

  return {
    verifyModal,
    verifyModalSubOrders,
    isVerifyingAddress,
    handleOpenVerifyAddress,
    handleOpenVerifyAllPending,
    handleConfirmVerifyAddress,
    closeVerifyModal,
    handleVerifyModalOpenChange,
  };
};

export default useVerifyAddressActions;
