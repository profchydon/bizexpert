import { useRef, useState } from "react";
import type { IEquipment } from "@/types/equipments";
import { resolveSystemReassignEquipId } from "../Drawers/SelectAReceiver/resolveReassignEquipmentIds";

type Params = {
  baseRoute: string;
  push: (path: string) => void;
  selectedRows: IEquipment[];
  openSystemReassign: (equipId: string | null) => void;
  startOffboardReassign: (item?: IEquipment) => void;
  seedOffboardingSelection: (item?: IEquipment) => void;
};

export function useAllEquipmentsReassignFlow({
  baseRoute,
  push,
  selectedRows,
  openSystemReassign,
  startOffboardReassign,
  seedOffboardingSelection,
}: Params) {
  const [isSelectReceiverFlowTypeOpen, setIsSelectReceiverFlowTypeOpen] =
    useState(false);
  const [selectedReceiverFlow, setSelectedReceiverFlow] = useState("");
  const pendingTransferItemRef = useRef<IEquipment | undefined>(undefined);

  const openReassignTypeModal = (item?: IEquipment) => {
    pendingTransferItemRef.current = item;
    setSelectedReceiverFlow("");
    setIsSelectReceiverFlowTypeOpen(true);
  };

  const closeReassignTypeModal = () => {
    setIsSelectReceiverFlowTypeOpen(false);
    setSelectedReceiverFlow("");
    pendingTransferItemRef.current = undefined;
  };

  const continueReassignType = () => {
    const item = pendingTransferItemRef.current;
    const flow = selectedReceiverFlow;
    closeReassignTypeModal();

    if (flow === "System reassignment") {
      const equipId = resolveSystemReassignEquipId(selectedRows, item);

      if (selectedRows.length > 0) {
        seedOffboardingSelection();
      } else if (equipId) {
        seedOffboardingSelection(item);
      }

      if (equipId) {
        push(`${baseRoute}?equip_id=${equipId}`);
      }

      openSystemReassign(equipId ?? null);
      return;
    }

    if (flow === "Off-boarding equipment") {
      startOffboardReassign(item);
    }
  };

  return {
    isSelectReceiverFlowTypeOpen,
    selectedReceiverFlow,
    setSelectedReceiverFlow,
    openReassignTypeModal,
    closeReassignTypeModal,
    continueReassignType,
  };
}
