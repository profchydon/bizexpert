import React from "react";
import { IEquipment } from "@/types/equipments";
import SelectAReceieverDate from "@/components/AllEquipments/Drawers/SelectAReceieverDate";
import StorageDuration from "@/components/AllEquipments/Drawers/StorageDuration";
import SalesPrice from "@/components/AllEquipments/Drawers/SalesPrice";
import SelectAReceiver from "@/components/AllEquipments/Drawers/SelectAReceiver";
import ReassignSelectEquipmentModal from "@/components/SingleAssetModal/ReassignSelectEquipment";
import AddEquipmentNote from "../../../Drawers/AddEquipmentNote";

interface FormattedItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

type Props = {
  equipID: string;
  equipment: IEquipment;
  allEquipment: IEquipment[];
  companyId: string;
  employeeDataOptions: FormattedItem[];
  currentEmployee: any;
  isSelectReceiverDateOpen: boolean;
  isStorageDurationOpen: boolean;
  isSalesPriceOpen: boolean;
  isSelectReceiverOpen: boolean;
  isSelectReceiverFlowTypeOpen: boolean;
  isSystemReassginOpen: boolean;
  isAddNoteOpen: boolean;
  selectedReceiverFlow: string;
  onSelectReceiverDateClose: () => void;
  onSelectReceiverDateNext: () => void;
  onStorageDurationClose: () => void;
  onStorageDurationNext: () => void;
  onSalesPriceClose: () => void;
  onSalesPriceNext: () => void;
  onSelectReceiverClose: () => void;
  onSelectReceiverNext: () => void;
  onSelectReceiverFlowTypeClose: () => void;
  setSelectedReceiverFlow: (value: string) => void;
  onSelectReceiverFlowContinue: () => void;
  onSystemReassignClose: () => void;
  onAddNoteClose: () => void;
};

const EquipmentSidebarDrawers = ({
  equipID,
  equipment,
  allEquipment,
  companyId,
  employeeDataOptions,
  currentEmployee,
  isSelectReceiverDateOpen,
  isStorageDurationOpen,
  isSalesPriceOpen,
  isSelectReceiverOpen,
  isSelectReceiverFlowTypeOpen,
  isSystemReassginOpen,
  isAddNoteOpen,
  selectedReceiverFlow,
  onSelectReceiverDateClose,
  onSelectReceiverDateNext,
  onStorageDurationClose,
  onStorageDurationNext,
  onSalesPriceClose,
  onSalesPriceNext,
  onSelectReceiverClose,
  onSelectReceiverNext,
  onSelectReceiverFlowTypeClose,
  setSelectedReceiverFlow,
  onSelectReceiverFlowContinue,
  onSystemReassignClose,
  onAddNoteClose,
}: Props) => (
  <>
    <SelectAReceieverDate
      baseRoute=""
      equipID={equipID}
      isOpen={isSelectReceiverDateOpen}
      onClose={onSelectReceiverDateClose}
      onNext={onSelectReceiverDateNext}
      isConfirmInstance
    />
    <StorageDuration
      isOpen={isStorageDurationOpen}
      onClose={onStorageDurationClose}
      onNext={onStorageDurationNext}
      equipID={equipID}
      equipmentsData={allEquipment}
    />
    <SalesPrice
      baseRoute=""
      isOpen={isSalesPriceOpen}
      onClose={onSalesPriceClose}
      equipID={equipID}
      companyId={companyId}
      equipmentsData={allEquipment}
      onNext={onSalesPriceNext}
    />
    <SelectAReceiver
      baseRoute=""
      equipID={equipID}
      isOpen={isSelectReceiverOpen}
      onClose={onSelectReceiverClose}
      onNext={onSelectReceiverNext}
      employeeDataOptions={employeeDataOptions}
      equipmentsData={allEquipment}
      singleEquipmentData={equipment}
      currentEmployee={currentEmployee}
    />
    <ReassignSelectEquipmentModal
      isOpen={isSelectReceiverFlowTypeOpen}
      onClose={onSelectReceiverFlowTypeClose}
      selectedStep={selectedReceiverFlow}
      setSelectedStep={setSelectedReceiverFlow}
      handleContinue={onSelectReceiverFlowContinue}
    />
    <SelectAReceiver
      baseRoute=""
      equipID={equipID}
      isOpen={isSystemReassginOpen}
      onClose={onSystemReassignClose}
      employeeDataOptions={employeeDataOptions}
      equipmentsData={allEquipment}
      singleEquipmentData={equipment}
      currentEmployee={currentEmployee}
      isReAssignInstance
    />
    <AddEquipmentNote
      isOpen={isAddNoteOpen}
      onClose={onAddNoteClose}
      equipmentId={equipID}
      companyId={companyId}
      defaultValues={equipment?.note || ""}
    />
  </>
);

export default EquipmentSidebarDrawers;
