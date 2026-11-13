import { useCallback, useState } from "react";
import type { DeviceConfig, EquipDeviceItem } from "./equipTypes";
import {
  addItem,
  removeItem,
  setConfig,
  setFulfilmentDate,
  setQuantity,
} from "./equipItems";
import { collectClaimedStorageIds } from "./storagePool";

export const useEquipDevicesState = (
  initialItems: Record<string, EquipDeviceItem[]> = {},
) => {
  const [itemsByEmployee, setItemsByEmployee] =
    useState<Record<string, EquipDeviceItem[]>>(initialItems);

  const getItems = useCallback(
    (employeeId: string): EquipDeviceItem[] =>
      itemsByEmployee[employeeId] ?? [],
    [itemsByEmployee],
  );

  const addDevice = useCallback(
    (employeeId: string, item: EquipDeviceItem) =>
      setItemsByEmployee((prev) => ({
        ...prev,
        [employeeId]: addItem(prev[employeeId] ?? [], item),
      })),
    [],
  );

  const prefillDevices = useCallback(
    (employeeId: string, items: EquipDeviceItem[]) =>
      setItemsByEmployee((prev) => {
        if ((prev[employeeId]?.length ?? 0) > 0 || items.length === 0)
          return prev;
        return { ...prev, [employeeId]: items };
      }),
    [],
  );

  const removeDevice = useCallback(
    (employeeId: string, lineId: string) =>
      setItemsByEmployee((prev) => ({
        ...prev,
        [employeeId]: removeItem(prev[employeeId] ?? [], lineId),
      })),
    [],
  );

  const clearDevices = useCallback(
    (employeeId: string) =>
      setItemsByEmployee((prev) =>
        (prev[employeeId]?.length ?? 0) === 0
          ? prev
          : { ...prev, [employeeId]: [] },
      ),
    [],
  );

  const changeQuantity = useCallback(
    (employeeId: string, lineId: string, quantity: number) =>
      setItemsByEmployee((prev) => ({
        ...prev,
        [employeeId]: setQuantity(prev[employeeId] ?? [], lineId, quantity),
      })),
    [],
  );

  const changeConfig = useCallback(
    (employeeId: string, lineId: string, config: DeviceConfig) =>
      setItemsByEmployee((prev) => ({
        ...prev,
        [employeeId]: setConfig(prev[employeeId] ?? [], lineId, config),
      })),
    [],
  );

  const changeFulfilmentDate = useCallback(
    (employeeId: string, lineId: string, fulfilmentDate: string) =>
      setItemsByEmployee((prev) => ({
        ...prev,
        [employeeId]: setFulfilmentDate(
          prev[employeeId] ?? [],
          lineId,
          fulfilmentDate,
        ),
      })),
    [],
  );

  const totalDeviceCount = useCallback(
    (): number =>
      Object.values(itemsByEmployee).reduce(
        (sum, items) => sum + items.length,
        0,
      ),
    [itemsByEmployee],
  );

  const claimedStorageIds = useCallback(
    (excludeEmployeeId: string, employeeIds: string[]): Set<string> =>
      collectClaimedStorageIds(itemsByEmployee, excludeEmployeeId, employeeIds),
    [itemsByEmployee],
  );

  return {
    getItems,
    addDevice,
    prefillDevices,
    removeDevice,
    clearDevices,
    changeQuantity,
    changeConfig,
    changeFulfilmentDate,
    totalDeviceCount,
    claimedStorageIds,
  };
};
