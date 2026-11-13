"use client";

import { useState } from "react";
import { LogOut, Share2 } from "lucide-react";
import {
  useAssignOfficeEmployeesMutation,
  useAssignOfficeEquipmentsMutation,
} from "@/api/baseQueries/companiesApi/officesApi/assignOfficeMembers";
import type { Office } from "../../types";
import { officeApiErrorMessage } from "../utils/officeApiError";
import { useOfficeReassignTargets } from "./useOfficesServer";

export const OFFBOARD_NO_DEVICES_MESSAGE =
  "Some selected employees have no assigned devices and can't be off-boarded.";

export const REASSIGN_ASSIGNED_ASSET_MESSAGE =
  "Assigned assets can't be moved to another office. Unassign them from the employee first.";

export interface OfficeOffboardAction {
  onClick: () => void;
  disabled: boolean;
  disabledReason?: string;
}

export interface OfficeReassignGuard {
  disabled?: boolean;
  disabledReason?: string;
}

export interface OfficeBulkAction {
  label: string;
  icon: typeof LogOut;
  onClick: () => void;
  disabled?: boolean;
  disabledReason?: string;
}

interface Params {
  office: Office;
  kind: "employees" | "assets";
  selectedIds: string[];
  onDone: () => void;
  onNotify: (title: string, description: string) => void;
  offboard?: OfficeOffboardAction;
  reassign?: OfficeReassignGuard;
}

export function useOfficeBulkActions({
  office,
  kind,
  selectedIds,
  onDone,
  onNotify,
  offboard,
  reassign,
}: Params) {
  const [reassignOpen, setReassignOpen] = useState(false);
  const targets = useOfficeReassignTargets(office);
  const [assignEmployees, employeesResult] = useAssignOfficeEmployeesMutation();
  const [assignEquipments, equipmentsResult] =
    useAssignOfficeEquipmentsMutation();

  const count = selectedIds.length;
  const noun = kind === "employees" ? "employee" : "asset";
  const plural = (value: number) => `${value} ${noun}${value === 1 ? "" : "s"}`;

  async function confirmReassign(dest: Office) {
    if (!dest.subsidiaryId || count === 0) return;
    try {
      if (kind === "employees") {
        await assignEmployees({
          companyId: dest.subsidiaryId,
          officeId: dest.id,
          sourceOfficeId: office.id,
          payload: { user_ids: selectedIds },
        }).unwrap();
      } else {
        await assignEquipments({
          companyId: dest.subsidiaryId,
          officeId: dest.id,
          sourceOfficeId: office.id,
          payload: { equipment_ids: selectedIds },
        }).unwrap();
      }
      onNotify("Reassigned", `${plural(count)} moved to ${dest.name}.`);
      setReassignOpen(false);
      onDone();
    } catch (error) {
      onNotify(
        "Reassign failed",
        officeApiErrorMessage(error, `Could not reassign ${plural(count)}.`),
      );
    }
  }

  const offboardAction: OfficeBulkAction[] = offboard
    ? [
        {
          label: "Off-board",
          icon: LogOut,
          onClick: offboard.onClick,
          disabled: offboard.disabled,
          disabledReason: offboard.disabledReason,
        },
      ]
    : [];

  const actions: OfficeBulkAction[] = [
    ...offboardAction,
    {
      label: "Reassign",
      icon: Share2,
      onClick: () => {
        if (reassign?.disabled) return;
        setReassignOpen(true);
      },
      disabled: reassign?.disabled,
      disabledReason: reassign?.disabledReason,
    },
  ];

  return {
    actions,
    targets,
    count,
    reassignOpen,
    isReassigning: employeesResult.isLoading || equipmentsResult.isLoading,
    closeReassign: () => setReassignOpen(false),
    confirmReassign,
  };
}
