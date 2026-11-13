import { useCallback } from "react";
import useOffboarding from "@/hooks/useOffboarding";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSelectedEquipment } from "@/store/slices/equipEmployeeSlice";
import { IAssetRefreshList } from "@/types/assetRefresh";
import { IEquipment } from "@/types/equipments";

export const useDeviceRefreshMultipleInstance = () => {
  const { transformData } = useOffboarding();
  const dispatch = useAppDispatch();

  const deviceRefreshSelectedEquipment = useAppSelector(
    (state) => state.persistedReducers.equipEmployee?.selectedEquipment,
  ) as IAssetRefreshList[];

  const handleDeviceRefresh = useCallback(
    (
      item: IEquipment | IEquipment[],
      actionType: string,
      selectedRows?: IAssetRefreshList[],
    ) => {
      const transformed: IAssetRefreshList[] =
        !(item as IEquipment)?.id &&
        !(item as IEquipment)?.title &&
        (selectedRows as IAssetRefreshList[])?.length > 0
          ? (transformData(selectedRows as any) as IAssetRefreshList[])
          : Array.isArray(item)
            ? (transformData(item as any) as IAssetRefreshList[])
            : [transformData(item) as IAssetRefreshList];

      const withActionType = transformed.map((entry) => ({
        ...entry,
        actionType: actionType || "Dispose",
      }));

      if (!deviceRefreshSelectedEquipment) {
        dispatch(setSelectedEquipment(withActionType as IAssetRefreshList[]));
      } else {
        const updatedData = withActionType.filter(
          (newItem) =>
            !deviceRefreshSelectedEquipment.some(
              (existingItem) => existingItem.id === newItem.id,
            ),
        );

        if (updatedData.length > 0) {
          dispatch(setSelectedEquipment(updatedData as IAssetRefreshList[]));
        }
      }
    },
    [deviceRefreshSelectedEquipment, dispatch, transformData],
  );

  return { handleDeviceRefresh };
};
