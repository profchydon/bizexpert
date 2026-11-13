import { useCallback, useState } from "react";
import { isStoredWindowValid, type DateWindow } from "./retrievalWindow";

export const useRetrievalWindows = () => {
  const [windows, setWindows] = useState<Record<string, DateWindow>>({});

  const setWindow = useCallback((employeeId: string, window: DateWindow) => {
    setWindows((prev) => ({ ...prev, [employeeId]: window }));
  }, []);

  const getWindow = useCallback(
    (employeeId: string): DateWindow | undefined => windows[employeeId],
    [windows],
  );

  const allAssigned = useCallback(
    (ids: string[]): boolean =>
      ids.length > 0 && ids.every((id) => isStoredWindowValid(windows[id])),
    [windows],
  );

  return { windows, setWindow, getWindow, allAssigned };
};
