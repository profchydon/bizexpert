"use client";

import { useCallback } from "react";
import routes from "@/routes";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import { setStorageToEmployeeItems } from "@/store/slices/equipEmployeeSlice";
import type { IEquipmentsInStorageByCountry } from "@/types/equipments";
import type { StoredDevice } from "../types/storage";
import { mapStoredDeviceToStorageEmployeeItem } from "../utils/mapStoredDeviceToStorageEmployeeItem";

function mergeStorageToEmployeeItems(
  existing: IEquipmentsInStorageByCountry[] | undefined,
  incoming: IEquipmentsInStorageByCountry[],
): IEquipmentsInStorageByCountry[] {
  const existingIds = new Set(existing?.map((item) => item.id) ?? []);
  const newItems = incoming.filter((item) => !existingIds.has(item.id));
  if (!existing?.length) return incoming;
  return newItems.length ? [...existing, ...newItems] : existing;
}

export function useStorageToEmployeeDeploy() {
  const dispatch = useAppDispatch();
  const storageToEmployeeItems = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.storageToEmployeeItems,
  );
  const { push, isPending } = useTransitionRouter();

  const startDeploy = useCallback(
    (devices: StoredDevice[]) => {
      if (devices.length === 0) return;
      const payload = devices.map(mapStoredDeviceToStorageEmployeeItem);
      dispatch(
        setStorageToEmployeeItems(
          mergeStorageToEmployeeItems(storageToEmployeeItems, payload),
        ),
      );
      dispatch(setSelectedEmployees([]));
      push(routes.STORAGE_SELECT_EMPLOYEES);
    },
    [dispatch, push, storageToEmployeeItems],
  );

  return { startDeploy, isDeployNavigating: isPending };
}
