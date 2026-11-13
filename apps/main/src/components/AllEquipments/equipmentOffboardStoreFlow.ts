import type { IEquipment } from "@/types/equipments";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import { isAssignedDevice } from "@/container/Dashboard/Employees/OffboardDevices/offboardPricing";
import { isBulkStoreEligible } from "./equipmentBulkActionEligibility";
import type { OffboardDispositionValidation } from "./equipmentOffboardReassignFlow";

function getAssigneeId(equipment: IEquipment) {
  const assigneeId = equipment.assignee?.id;
  if (!assigneeId || assigneeId === UNASSIGNED_ORDER_SUMMARY_KEY) {
    return null;
  }
  return String(assigneeId);
}

export function validateOffboardStoreSelection(
  equipment: IEquipment[],
): OffboardDispositionValidation {
  if (equipment.length === 0) {
    return {
      ok: false,
      message: "Select at least one assigned device to store.",
    };
  }

  const storeEligible = equipment.filter(
    (item) => item.id && isBulkStoreEligible(item.status),
  );

  if (storeEligible.length === 0) {
    return {
      ok: false,
      message: "Store isn't available for the selected equipment.",
    };
  }

  const assignedWithAssignee = storeEligible.filter(
    (item) => isAssignedDevice(item) && getAssigneeId(item),
  );

  if (assignedWithAssignee.length === 0) {
    return {
      ok: false,
      message: "Store requires equipment assigned to an employee.",
    };
  }

  if (assignedWithAssignee.length !== storeEligible.length) {
    return {
      ok: false,
      message:
        "Select only assigned equipment assigned to the same employee to store.",
    };
  }

  const assigneeIds = [
    ...new Set(
      assignedWithAssignee.map((item) => getAssigneeId(item) as string),
    ),
  ];

  if (assigneeIds.length > 1) {
    return {
      ok: false,
      message: "Select equipment assigned to the same employee to store.",
    };
  }

  return {
    ok: true,
    assigneeId: assigneeIds[0],
    deviceIds: assignedWithAssignee.map((item) => String(item.id)),
  };
}
