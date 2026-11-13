import { useEffect, useState } from "react";
import { getActionType } from "@/components/Offboarding/util";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateOffboardingData } from "@/store/slices/offboardingSlice";
import { ActionType, Offboard_asset } from "@/types/offboarding";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { cancelSelectReceiverDateFlow } from "./selectReceiverDateCancel";
import {
  buildCollectionDateOffboardingUpdate,
  getSelectReceiverDateRedirectPath,
} from "./selectReceiverDateSubmit";

type Params = {
  baseRoute?: string;
  onClose: () => void;
  onNext: () => void;
  equipID?: string | null;
  isEditable?: boolean;
  selectedRows?: Array<{ id: string }>;
  setSelectedRows?: () => void;
  isConfirmInstance?: boolean;
};

export function useSelectReceiverDateFlow({
  baseRoute,
  onClose,
  onNext,
  equipID,
  isEditable,
  selectedRows,
  setSelectedRows,
  isConfirmInstance,
}: Params) {
  const { push } = useTransitionRouter();
  const dispatch = useAppDispatch();
  const [selectDate, setSelectDate] = useState<Date | string>();
  const [isStorageConfirm, setIsStorageConfirm] = useState(false);
  const [isSaleConfirm, setIsSaleConfirm] = useState(false);
  const [isTransferConfirm, setIsTransferConfirm] = useState(false);

  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset;

  useEffect(() => {
    if (Array.isArray(offboardingData)) {
      const findCollectionDate = offboardingData.find(
        (item) => item?.id === equipID,
      );
      setSelectDate(findCollectionDate?.collectionDate as string);
      return;
    }

    setSelectDate(offboardingData?.collectionDate as string);
  }, [equipID, isEditable, offboardingData]);

  const handleDateChange = (value: Date) => {
    if (value !== selectDate) {
      setSelectDate(value);
    }
  };

  const handleSubmit = () => {
    const selectedRowIds = selectedRows?.map((row) => row.id) || [];
    dispatch(
      updateOffboardingData(
        buildCollectionDateOffboardingUpdate({
          offboardingData,
          selectDate,
          equipID,
          selectedRowIds,
        }),
      ),
    );

    displaySuccessMessage(
      isEditable ? "Action updated" : "Action added",
      isEditable
        ? "The Off board action has been updated successfully."
        : "The Off board action has been added successfully.",
    );

    setSelectDate(typeof selectDate === "string" ? selectDate : "");
    setSelectedRows?.();

    if (!isConfirmInstance) {
      onNext();
      const redirectPath = getSelectReceiverDateRedirectPath(
        baseRoute,
        isEditable,
      );
      if (redirectPath) push(redirectPath);
      onClose();
      return;
    }

    onClose();
    openConfirmModal();
    onNext();
  };

  const handleCancel = () => {
    cancelSelectReceiverDateFlow({
      dispatch,
      offboardingData,
      equipID,
      baseRoute,
      isEditable,
      setSelectedRows,
      push,
    });
    onClose();
  };

  const openConfirmModal = () => {
    const checkActionType = getActionType(
      offboardingData,
      equipID as string,
    ) as ActionType;
    const checkActionMap: Partial<Record<ActionType, () => void>> = {
      Transfer: () => setIsTransferConfirm(true),
      Store: () => setIsStorageConfirm(true),
      Sale: () => setIsSaleConfirm(true),
    };
    checkActionMap[checkActionType]?.();
  };

  const closeConfirmModals = () => {
    setIsTransferConfirm(false);
    setIsStorageConfirm(false);
    setIsSaleConfirm(false);
  };

  const checkSubmitInstance = () => {
    if (!isConfirmInstance) {
      handleSubmit();
      return;
    }
    openConfirmModal();
  };

  const handleConfirmSubmit = () => {
    closeConfirmModals();
    handleSubmit();
  };

  const handleConfirmCancel = () => {
    closeConfirmModals();
    handleCancel();
  };

  return {
    selectDate,
    isStorageConfirm,
    isSaleConfirm,
    isTransferConfirm,
    handleDateChange,
    handleCancel,
    checkSubmitInstance,
    handleConfirmSubmit,
    handleConfirmCancel,
  };
}
