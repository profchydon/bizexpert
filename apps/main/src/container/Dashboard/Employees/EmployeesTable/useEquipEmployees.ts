import { useState } from "react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useAppDispatch } from "@/store";
import {
  resetEquipReview,
  setEquipEmployees,
} from "@/store/slices/employeeSlice";
import { clearDeviceRefreshFlowState } from "@/store/slices/equipEmployeeSlice";
import routes from "@/routes";
import { resolveCountryText } from "@/utils/resolveCountryText";
import type { IEmployees } from "@/types/employees";

export const useEquipEmployees = (selectedRows: IEmployees[]) => {
  const { push, isPending } = useTransitionRouter();
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const start = () => {
    if (selectedRows.length === 0) return;
    dispatch(clearDeviceRefreshFlowState());
    dispatch(setEquipEmployees(selectedRows));
    dispatch(resetEquipReview());
    const ids = selectedRows.map((employee) => String(employee.id)).join(",");
    push(`${routes.EMPLOYEES_ONBOARD_DEVICES}?employees=${ids}`);
  };

  const equipOne = (employee: IEmployees) => {
    if (!resolveCountryText(employee.country)) return;
    setActiveEmployeeId(String(employee.id));
    dispatch(clearDeviceRefreshFlowState());
    dispatch(setEquipEmployees([employee]));
    dispatch(resetEquipReview());
    push(
      `${routes.EMPLOYEES_ONBOARD_DEVICES}?employees=${String(employee.id)}`,
    );
  };

  const isRowLoading = (employeeId: string) =>
    Boolean(isPending && activeEmployeeId === employeeId);

  return { start, equipOne, isPending, isRowLoading };
};
