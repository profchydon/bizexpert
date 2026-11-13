"use client";

import React from "react";
import StoreEquipmentModal from "@/components/SingleAssetModal/StoreEquipmentModal";
import SaleEquipmentModal from "@/components/SingleAssetModal/SaleEquipmentModal";
import ReassignEquipmentModal from "@/components/SingleAssetModal/ReassignEquipmentModal";
import { SelectAReceiverDateSlideout } from "./SelectAReceiverDateSlideout";
import { isValidCollectionStartDate } from "./selectReceiverDateValidation";
import { useSelectReceiverDateFlow } from "./useSelectReceiverDateFlow";

interface Props {
  isOpen: boolean;
  baseRoute?: string;
  onClose: () => void;
  onNext: () => void;
  equipID?: string | null;
  isEditable?: boolean;
  selectedRows?: any[];
  setSelectedRows?: () => void;
  isConfirmInstance?: boolean;
}

const SelectAReceieverDate: React.FC<Props> = (props) => {
  const {
    selectDate,
    isStorageConfirm,
    isSaleConfirm,
    isTransferConfirm,
    handleDateChange,
    handleCancel,
    checkSubmitInstance,
    handleConfirmSubmit,
    handleConfirmCancel,
  } = useSelectReceiverDateFlow(props);

  return (
    <>
      <SelectAReceiverDateSlideout
        isOpen={props.isOpen}
        isEditable={props.isEditable}
        selectDate={selectDate}
        submitDisabled={!isValidCollectionStartDate(selectDate)}
        onClose={handleCancel}
        onCancel={handleCancel}
        onSubmit={checkSubmitInstance}
        onDateChange={handleDateChange}
      />
      <StoreEquipmentModal
        isOpen={isStorageConfirm}
        onClose={handleConfirmCancel}
        handleConfirm={handleConfirmSubmit}
      />
      <SaleEquipmentModal
        isOpen={isSaleConfirm}
        onClose={handleConfirmCancel}
        handleConfirm={handleConfirmSubmit}
      />
      <ReassignEquipmentModal
        isOpen={isTransferConfirm}
        onClose={handleConfirmCancel}
        handleConfirm={handleConfirmSubmit}
      />
    </>
  );
};

export default SelectAReceieverDate;
