import type { ReduxDispatch } from "@/store/store";
import {
  resetOffboardReview,
  setOffboardEmployees,
} from "@/store/slices/employeeSlice";
import { clearDeviceRefreshFlowState } from "@/store/slices/equipEmployeeSlice";
import { resolveDispositionDeviceIds } from "@/container/Dashboard/Employees/EmployeeDetails/employeeEquipmentDisposition";
import { startOffboardWithDisposition } from "@/container/Dashboard/Employees/OffboardDevices/offboardIntent";
import routes from "@/routes";
import type { IEquipment } from "@/types/equipments";
import type { IEmployees } from "@/types/employees";
import type { Disposition } from "@/types/offboard";
import { toast } from "sonner";
import {
  resolveOffboardEmployeeRecord,
  type OffboardDispositionValidation,
} from "./equipmentOffboardReassignFlow";

type StartParams = {
  equipment: IEquipment[];
  validation: Extract<OffboardDispositionValidation, { ok: true }>;
  employees: IEmployees[];
  dispatch: ReduxDispatch;
  push: (path: string) => void;
  disposition: Disposition;
  onStarted?: () => void;
};

export function startEquipmentOffboardDisposition({
  equipment,
  validation,
  employees,
  dispatch,
  push,
  disposition,
  onStarted,
}: StartParams) {
  const employee = resolveOffboardEmployeeRecord(
    validation.assigneeId,
    equipment,
    employees,
  );
  const resolvedIds = resolveDispositionDeviceIds(
    employee,
    validation.deviceIds,
  );
  const deviceIds = resolvedIds.length > 0 ? resolvedIds : validation.deviceIds;

  if (deviceIds.length === 0) {
    toast.error(
      "Only assigned equipment can be reassigned, stored, or disposed.",
    );
    return false;
  }

  dispatch(clearDeviceRefreshFlowState());
  dispatch(resetOffboardReview());
  dispatch(setOffboardEmployees([employee]));
  startOffboardWithDisposition({
    employeeId: validation.assigneeId,
    deviceIds,
    disposition,
  });
  push(routes.EMPLOYEES_OFFBOARD_DEVICES);
  onStarted?.();
  return true;
}
