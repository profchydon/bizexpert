import { useCallback, useMemo, useState } from "react";
import type { IEmployees } from "@/types/employees";
import {
  buildSelectionRecord,
  isPageFullySelected,
  isPagePartiallySelected,
  toggleEmployee,
  togglePage,
  type SelectionMap,
} from "./offboardSelection";

export const useEmployeeSelection = (pageEmployees: IEmployees[]) => {
  const [selectedMap, setSelectedMap] = useState<SelectionMap>({});

  const selectedRows = useMemo(() => Object.values(selectedMap), [selectedMap]);
  const selectedIds = useMemo(
    () => new Set(Object.keys(selectedMap)),
    [selectedMap],
  );
  const externalRowSelection = useMemo(
    () => buildSelectionRecord(selectedMap),
    [selectedMap],
  );

  const toggleRow = useCallback(
    (employee: IEmployees, checked: boolean) =>
      setSelectedMap((prev) => toggleEmployee(prev, employee, checked)),
    [],
  );

  const toggleAllPage = useCallback(
    (checked: boolean) =>
      setSelectedMap((prev) => togglePage(prev, pageEmployees, checked)),
    [pageEmployees],
  );

  const clearSelection = useCallback(() => setSelectedMap({}), []);

  return {
    selectedRows,
    selectedIds,
    externalRowSelection,
    isAllPageSelected: isPageFullySelected(selectedMap, pageEmployees),
    isSomePageSelected: isPagePartiallySelected(selectedMap, pageEmployees),
    toggleRow,
    toggleAllPage,
    clearSelection,
  };
};
