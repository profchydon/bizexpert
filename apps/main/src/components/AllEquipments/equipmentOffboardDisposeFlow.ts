import type { IEquipment } from "@/types/equipments";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import { isAssignedDevice } from "@/container/Dashboard/Employees/OffboardDevices/offboardPricing";
import { isBulkDisposeEligible } from "./equipmentBulkActionEligibility";
import type { OffboardDispositionValidation } from "./equipmentOffboardReassignFlow";

function getAssigneeId(equipment: IEquipment) {
  const assigneeId = equipment.assignee?.id;
  if (!assigneeId || assigneeId === UNASSIGNED_ORDER_SUMMARY_KEY) {
    return null;
  }
  return String(assigneeId);
}

export function validateOffboardDisposeSelection(
  equipment: IEquipment[],
): OffboardDispositionValidation {
  if (equipment.length === 0) {
    return {
      ok: false,
      message: "Select at least one assigned device to dispose.",
    };
  }

  const disposeEligible = equipment.filter(
    (item) => item.id && isBulkDisposeEligible(item.status),
  );

  if (disposeEligible.length === 0) {
    return {
      ok: false,
      message: "Dispose isn't available for the selected equipment.",
    };
  }

  const assignedWithAssignee = disposeEligible.filter(
    (item) => isAssignedDevice(item) && getAssigneeId(item),
  );

  if (assignedWithAssignee.length === 0) {
    return {
      ok: false,
      message: "Dispose requires equipment assigned to an employee.",
    };
  }

  if (assignedWithAssignee.length !== disposeEligible.length) {
    return {
      ok: false,
      message:
        "Select only assigned equipment assigned to the same employee to dispose.",
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
      message: "Select equipment assigned to the same employee to dispose.",
    };
  }

  return {
    ok: true,
    assigneeId: assigneeIds[0],
    deviceIds: assignedWithAssignee.map((item) => String(item.id)),
  };
}
