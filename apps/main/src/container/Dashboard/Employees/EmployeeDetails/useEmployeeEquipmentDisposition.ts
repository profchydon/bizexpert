"use client";

import { useState } from "react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useAppDispatch } from "@/store";
import {
  resetOffboardReview,
  setOffboardEmployees,
} from "@/store/slices/employeeSlice";
import { clearDeviceRefreshFlowState } from "@/store/slices/equipEmployeeSlice";
import routes from "@/routes";
import type { IEmployees } from "@/types/employees";
import type { Disposition } from "@/types/offboard";
import { toast } from "sonner";
import { resolveDispositionDeviceIds } from "./employeeEquipmentDisposition";
import { startOffboardWithDisposition } from "../OffboardDevices/offboardIntent";

export const useEmployeeEquipmentDisposition = (employee?: IEmployees) => {
  const { push, isPending } = useTransitionRouter();
  const dispatch = useAppDispatch();
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
  const [activeDisposition, setActiveDisposition] =
    useState<Disposition | null>(null);

  const startDisposition = (disposition: Disposition, deviceIds: string[]) => {
    if (!employee?.id || deviceIds.length === 0) {
      return;
    }

    const resolvedIds = resolveDispositionDeviceIds(employee, deviceIds);
    if (resolvedIds.length === 0) {
      toast.error(
        "Only assigned equipment can be reassigned, stored, or disposed.",
      );
      return;
    }

    const employeeId = String(employee.id);
    setActiveEmployeeId(employeeId);
    setActiveDisposition(disposition);
    dispatch(clearDeviceRefreshFlowState());
    dispatch(resetOffboardReview());
    dispatch(setOffboardEmployees([employee]));
    startOffboardWithDisposition({
      employeeId,
      deviceIds: resolvedIds,
      disposition,
    });
    push(routes.EMPLOYEES_OFFBOARD_DEVICES);
  };

  const isRowLoading = (employeeId: string) =>
    Boolean(isPending && activeEmployeeId === employeeId);

  const getPendingDisposition = (employeeId: string): Disposition | null =>
    isRowLoading(employeeId) ? activeDisposition : null;

  return { startDisposition, isPending, isRowLoading, getPendingDisposition };
};
