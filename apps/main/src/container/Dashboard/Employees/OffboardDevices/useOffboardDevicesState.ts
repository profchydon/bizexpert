import { useCallback, useState } from "react";
import type { IEquipment } from "@/types/equipments";
import {
  applyDispositionToLine,
  applyWipeToLine,
  buildDeviceLines,
  isReassignIncomplete,
  mergeDeviceLinesWithReview,
  type DeviceLine,
  type Disposition,
  type ReassignTarget,
  type WipeType,
} from "./offboardPricing";
import { useOffboardDeviceSelection } from "./useOffboardDeviceSelection";

export const useOffboardDevicesState = () => {
  const [linesByEmployee, setLinesByEmployee] = useState<
    Record<string, DeviceLine[]>
  >({});
  const selection = useOffboardDeviceSelection();

  const ensureLines = useCallback(
    (
      employeeId: string,
      equipment: IEquipment[] | undefined | null,
      reviewDevices?: DeviceLine[],
    ) => {
      const { lines, selection: nextSelection } = mergeDeviceLinesWithReview(
        buildDeviceLines(equipment),
        reviewDevices,
      );
      setLinesByEmployee((prev) =>
        prev[employeeId] ? prev : { ...prev, [employeeId]: lines },
      );
      selection.ensureSelection(employeeId, nextSelection);
    },
    [selection.ensureSelection],
  );

  const ensureLinesFromBuilt = useCallback(
    (
      employeeId: string,
      lines: DeviceLine[],
      nextSelection: string[],
      options?: { replace?: boolean },
    ) => {
      const replace = options?.replace ?? false;
      setLinesByEmployee((prev) =>
        replace || !prev[employeeId] ? { ...prev, [employeeId]: lines } : prev,
      );
      selection.ensureSelection(employeeId, nextSelection, replace);
    },
    [selection.ensureSelection],
  );

  const updateLine = useCallback(
    (employeeId: string, lineId: string, patch: Partial<DeviceLine>) => {
      setLinesByEmployee((prev) => ({
        ...prev,
        [employeeId]: (prev[employeeId] ?? []).map((line) =>
          line.id === lineId ? { ...line, ...patch } : line,
        ),
      }));
    },
    [],
  );

  const setDisposition = useCallback(
    (employeeId: string, lineId: string, disposition: Disposition) =>
      setLinesByEmployee((prev) => ({
        ...prev,
        [employeeId]: (prev[employeeId] ?? []).map((line) =>
          line.id === lineId ? applyDispositionToLine(line, disposition) : line,
        ),
      })),
    [],
  );

  const setWipe = useCallback(
    (employeeId: string, lineId: string, wipeType: WipeType) =>
      updateLine(employeeId, lineId, { wipeType }),
    [updateLine],
  );

  const setReassignTarget = useCallback(
    (employeeId: string, lineId: string, reassignTarget: ReassignTarget) =>
      updateLine(employeeId, lineId, { reassignTarget }),
    [updateLine],
  );

  const updateLines = useCallback(
    (employeeId: string, lineIds: string[], patch: Partial<DeviceLine>) => {
      const ids = new Set(lineIds);
      setLinesByEmployee((prev) => ({
        ...prev,
        [employeeId]: (prev[employeeId] ?? []).map((line) =>
          ids.has(line.id) ? { ...line, ...patch } : line,
        ),
      }));
    },
    [],
  );

  const setDispositionMany = useCallback(
    (employeeId: string, lineIds: string[], disposition: Disposition) => {
      const ids = new Set(lineIds);
      setLinesByEmployee((prev) => ({
        ...prev,
        [employeeId]: (prev[employeeId] ?? []).map((line) =>
          ids.has(line.id) ? applyDispositionToLine(line, disposition) : line,
        ),
      }));
    },
    [],
  );

  const setWipeMany = useCallback(
    (employeeId: string, lineIds: string[], wipeType: WipeType) => {
      const ids = new Set(lineIds);
      setLinesByEmployee((prev) => ({
        ...prev,
        [employeeId]: (prev[employeeId] ?? []).map((line) =>
          ids.has(line.id) ? applyWipeToLine(line, wipeType) : line,
        ),
      }));
    },
    [],
  );

  const reassignMany = useCallback(
    (employeeId: string, lineIds: string[], reassignTarget: ReassignTarget) =>
      updateLines(employeeId, lineIds, {
        disposition: "REASSIGN",
        reassignTarget,
      }),
    [updateLines],
  );

  const getLines = useCallback(
    (employeeId: string): DeviceLine[] => linesByEmployee[employeeId] ?? [],
    [linesByEmployee],
  );

  const getSelectedLines = useCallback(
    (employeeId: string): DeviceLine[] =>
      selection.getSelectedLines(employeeId, linesByEmployee[employeeId] ?? []),
    [linesByEmployee, selection.getSelectedLines],
  );

  const hasUnassignedReassign = useCallback(
    (): boolean =>
      Object.keys(linesByEmployee).some((employeeId) =>
        getSelectedLines(employeeId).some(isReassignIncomplete),
      ),
    [linesByEmployee, getSelectedLines],
  );

  return {
    ensureLines,
    ensureLinesFromBuilt,
    updateLine,
    setDisposition,
    setWipe,
    setReassignTarget,
    setDispositionMany,
    setWipeMany,
    reassignMany,
    toggleSelect: selection.toggleSelect,
    setSelection: selection.setSelection,
    getLines,
    getSelectedIds: selection.getSelectedIds,
    getSelectedLines,
    hasUnassignedReassign,
  };
};
