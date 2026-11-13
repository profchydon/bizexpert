import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { IEmployees } from "@/types/employees";
import type { IEquipment } from "@/types/equipments";
import type {
  DateWindow,
  DeviceLine,
  OffboardReviewEmployee,
} from "@/types/offboard";
import type { OffboardEmployeeBasic } from "./EmployeeSwitcherStrip";
import {
  applyOffboardIntentToLines,
  consumeOffboardIntent,
} from "./offboardIntent";
import { buildDeviceLines } from "./offboardPricing";
import { isStoredWindowValid } from "./retrievalWindow";

interface RestoreParams {
  editEmployeeId: string | null;
  employees: OffboardEmployeeBasic[];
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  currentId?: string;
  fetchedEmployee?: IEmployees;
  isCurrentEmployee: boolean;
  review?: OffboardReviewEmployee[] | null;
  ensureLines: (
    employeeId: string,
    equipment: IEquipment[] | undefined | null,
    reviewDevices?: DeviceLine[],
  ) => void;
  ensureLinesFromBuilt: (
    employeeId: string,
    lines: DeviceLine[],
    selection: string[],
    options?: { replace?: boolean },
  ) => void;
  getWindow: (employeeId: string) => DateWindow | undefined;
  setWindow: (employeeId: string, window: DateWindow) => void;
}

export const useOffboardReviewRestore = ({
  editEmployeeId,
  employees,
  setCurrentIndex,
  currentId,
  fetchedEmployee,
  isCurrentEmployee,
  review,
  ensureLines,
  ensureLinesFromBuilt,
  getWindow,
  setWindow,
}: RestoreParams) => {
  const focusedEditId = useRef(false);

  useEffect(() => {
    if (focusedEditId.current || !editEmployeeId || employees.length === 0) {
      return;
    }
    const index = employees.findIndex(
      (employee) => employee.id === editEmployeeId,
    );
    if (index >= 0) setCurrentIndex(index);
    focusedEditId.current = true;
  }, [editEmployeeId, employees, setCurrentIndex]);

  useEffect(() => {
    if (!currentId || !fetchedEmployee || !isCurrentEmployee) return;
    const reviewed = review?.find((entry) => entry.id === currentId);
    if (reviewed) {
      ensureLines(currentId, fetchedEmployee.equipment, reviewed.devices);
    } else {
      const intent = consumeOffboardIntent(currentId);
      if (intent) {
        const built = buildDeviceLines(fetchedEmployee.equipment);
        const { lines, selection } = applyOffboardIntentToLines(built, intent);
        ensureLinesFromBuilt(currentId, lines, selection, { replace: true });
      } else {
        ensureLines(currentId, fetchedEmployee.equipment);
      }
    }
    const reviewedWindow = review?.find((entry) => entry.id === currentId);
    if (
      isStoredWindowValid(reviewedWindow?.window) &&
      reviewedWindow?.window &&
      !getWindow(currentId)
    ) {
      setWindow(currentId, reviewedWindow.window);
    }
  }, [
    currentId,
    fetchedEmployee,
    isCurrentEmployee,
    ensureLines,
    ensureLinesFromBuilt,
    review,
    getWindow,
    setWindow,
  ]);
};
