import { useCallback, useState } from "react";
import type { DeviceLine } from "./offboardPricing";

export const useOffboardDeviceSelection = () => {
  const [selectedByEmployee, setSelectedByEmployee] = useState<
    Record<string, string[]>
  >({});

  const ensureSelection = useCallback(
    (employeeId: string, selection: string[], replace = false) => {
      setSelectedByEmployee((prev) =>
        replace || !prev[employeeId]
          ? { ...prev, [employeeId]: selection }
          : prev,
      );
    },
    [],
  );

  const toggleSelect = useCallback(
    (employeeId: string, lineId: string, checked: boolean) =>
      setSelectedByEmployee((prev) => {
        const set = new Set(prev[employeeId] ?? []);
        if (checked) set.add(lineId);
        else set.delete(lineId);
        return { ...prev, [employeeId]: Array.from(set) };
      }),
    [],
  );

  const setSelection = useCallback(
    (employeeId: string, lineIds: string[]) =>
      setSelectedByEmployee((prev) => ({ ...prev, [employeeId]: lineIds })),
    [],
  );

  const getSelectedIds = useCallback(
    (employeeId: string): string[] => selectedByEmployee[employeeId] ?? [],
    [selectedByEmployee],
  );

  const getSelectedLines = useCallback(
    (employeeId: string, lines: DeviceLine[]): DeviceLine[] => {
      const set = new Set(selectedByEmployee[employeeId] ?? []);
      return lines.filter((line) => set.has(line.id));
    },
    [selectedByEmployee],
  );

  return {
    selectedByEmployee,
    ensureSelection,
    toggleSelect,
    setSelection,
    getSelectedIds,
    getSelectedLines,
  };
};
