"use client";

import {
  RefreshCcw,
  Package,
  ScanEye,
  FilePenLine,
  Trash2Icon,
} from "lucide-react";
import ActionItem from "@/components/Offboarding/ActionItem";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import {
  getRowActionDisabledState,
  getTransferActionLabel,
} from "@/components/AllEquipments/equipmentRowActionState";
import { normalizeEquipmentStatusKey } from "@/components/AllEquipments/equipmentBulkActionEligibility";

type Item = {
  id: string;
  status?: string;
};

type Props = {
  item: Item;
  matchedActionType?: string;
  showViewAndEditActions: boolean;
  onView: () => void;
  onEdit?: () => void;
  onTransfer: () => void;
  onStore?: () => void;
  onDispose: () => void;
  onRefreshStore: () => void;
  isDeviceRefreshEquipment?: boolean;
  isDeviceRefresh?: boolean;
};

export function EquipmentTableActionMenuItems({
  item,
  matchedActionType,
  showViewAndEditActions,
  onView,
  onEdit,
  onTransfer,
  onStore,
  onDispose,
  onRefreshStore,
  isDeviceRefreshEquipment,
  isDeviceRefresh,
}: Props) {
  const equipmentStatus = normalizeEquipmentStatusKey(item.status);
  const transferState = getRowActionDisabledState(
    item.status,
    "transfer",
    matchedActionType,
  );
  const storeState = getRowActionDisabledState(
    item.status,
    "store",
    matchedActionType,
  );
  const disposeState = getRowActionDisabledState(
    item.status,
    "dispose",
    matchedActionType,
  );

  if (!isDeviceRefreshEquipment && !isDeviceRefresh) {
    return (
      <>
        {showViewAndEditActions ? (
          <>
            <ActionItem
              label="View equipment"
              Icon={ScanEye}
              onClick={onView}
            />
            {(equipmentStatus === "assigned" ||
              equipmentStatus === "in_storage" ||
              equipmentStatus ===
                UNASSIGNED_ORDER_SUMMARY_KEY.toLowerCase()) && (
              <ActionItem
                label="Edit equipment"
                Icon={FilePenLine}
                onClick={onEdit}
              />
            )}
          </>
        ) : null}
        <ActionItem
          label={getTransferActionLabel(item.status)}
          Icon={RefreshCcw}
          disabled={transferState.isDisabled}
          disabledReason={transferState.reason}
          onClick={onTransfer}
        />
        <ActionItem
          label="Store equipment"
          Icon={Package}
          disabled={storeState.isDisabled}
          disabledReason={storeState.reason}
          onClick={onStore}
        />
      </>
    );
  }

  if (isDeviceRefreshEquipment && isDeviceRefresh) {
    return (
      <>
        <ActionItem label="View equipment" Icon={ScanEye} onClick={onView} />
        <ActionItem
          label="Dispose equipment"
          Icon={Trash2Icon}
          disabled={disposeState.isDisabled}
          disabledReason={disposeState.reason}
          onClick={onDispose}
        />
        <ActionItem
          label="Store equipment"
          Icon={Package}
          disabled={storeState.isDisabled}
          disabledReason={storeState.reason}
          onClick={onRefreshStore}
        />
      </>
    );
  }

  return null;
}
