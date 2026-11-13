"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  useStorageServiceFeesState,
  type StorageServiceFeesValue,
} from "./useStorageServiceFeesState";

const StorageServiceFeesContext = createContext<StorageServiceFeesValue | null>(
  null,
);

export function StorageServiceFeesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useStorageServiceFeesState();
  return (
    <StorageServiceFeesContext.Provider value={value}>
      {children}
    </StorageServiceFeesContext.Provider>
  );
}

export function useStorageServiceFees(): StorageServiceFeesValue {
  const context = useContext(StorageServiceFeesContext);
  if (context) return context;
  return useStorageServiceFeesState();
}
