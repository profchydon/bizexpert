import { useMemo, useState } from "react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useAppDispatch } from "@/store";
import { setOffboardEmployees } from "@/store/slices/employeeSlice";
import { clearDeviceRefreshFlowState } from "@/store/slices/equipEmployeeSlice";
import routes from "@/routes";
import type { IEmployees } from "@/types/employees";
import { getOffboardEligibility, hasAssignedDevices } from "./employeeDevices";

export const useOffboardConfirm = (selectedRows: IEmployees[]) => {
  const { push, isPending } = useTransitionRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);

  const { offboardableRows, excludedCount, canOffboard } = useMemo(
    () => getOffboardEligibility(selectedRows),
    [selectedRows],
  );

  const start = () => {
    if (offboardableRows.length === 0) return;
    dispatch(clearDeviceRefreshFlowState());
    dispatch(setOffboardEmployees(offboardableRows));
    push(routes.EMPLOYEES_OFFBOARD_DEVICES);
  };

  const offboardOne = (employee: IEmployees) => {
    if (!hasAssignedDevices(employee as any)) return;
    setActiveEmployeeId(String(employee.id));
    dispatch(clearDeviceRefreshFlowState());
    dispatch(setOffboardEmployees([employee]));
    push(routes.EMPLOYEES_OFFBOARD_DEVICES);
  };

  const isRowLoading = (employeeId: string) =>
    Boolean(isPending && activeEmployeeId === employeeId);

  return {
    isOpen,
    open: () => setIsOpen(true),
    setIsOpen,
    start,
    offboardOne,
    offboardableRows,
    excludedCount,
    canOffboard,
    isPending,
    isRowLoading,
  };
};
