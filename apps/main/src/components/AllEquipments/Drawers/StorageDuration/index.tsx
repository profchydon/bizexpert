import React, { useEffect, useMemo, useState } from "react";

import DrawerRight from "@/components/DrawerRight";
import SingleInstance from "./SingleInstance";
import MultipleInstance from "./MultipleInstance";
import { IEquipment } from "@/types/equipments";
import { useAppDispatch, useAppSelector } from "@/store";
import { Offboard_asset } from "@/types/offboarding";
import {
  deleteOffboardingData,
  updateOffboardingData,
} from "@/store/slices/offboardingSlice";
import { useRouter, useSearchParams } from "next/navigation";
import PageState from "@/components/PageState";
import { IBuyToStorage } from "@/types/buytostorage";
import {
  deleteOnboardingBuytostorageData,
  updateOnboardingBuytostorageData,
} from "@/store/slices/onboardingBuytostorageSlice";
import useOffboarding from "@/hooks/useOffboarding";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  title?: string;
  description?: string;
  equipID?: string | null;
  equipmentsData?: IEquipment[];
  isLoading?: boolean;
  isError?: boolean;
  setSelectedRows?: () => void;
  isEditable?: boolean;
}

const StorageDuration: React.FC<Props> = ({
  isOpen,
  onClose,
  onNext,
  title,
  description,
  isLoading,
  isError,
  setSelectedRows,
  isEditable,
  equipmentsData,
  equipID,
}) => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const actionBuyToStorageInstance = Boolean(
    searchParams.get("action_buy_to_storage"),
  );
  const equip_id = searchParams.get("equip_id");
  const [storageDuration, setStorageDuration] =
    useState<Record<string, string | null>>();

  const { transformData } = useOffboarding();

  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset[];
  const onboardingBuytostorage = useAppSelector(
    (state) => state.persistedReducers.onboardingBuytostorage,
  ) as IBuyToStorage[];

  const isMultiple = useMemo(() => {
    const data = actionBuyToStorageInstance
      ? onboardingBuytostorage
      : offboardingData;
    return Array.isArray(data) && data.length > 0;
  }, [actionBuyToStorageInstance, offboardingData, onboardingBuytostorage]);

  useEffect(() => {
    const data = actionBuyToStorageInstance
      ? onboardingBuytostorage
      : offboardingData;

    if (Array.isArray(data)) {
      const transformObject: Record<string, string> = data.reduce(
        (acc, item) => {
          // @ts-ignore
          if (item.storageDuration) acc[item.id] = item.storageDuration;
          return acc;
        },
        {},
      );
      setStorageDuration(transformObject);
    }
  }, [offboardingData, onboardingBuytostorage, actionBuyToStorageInstance]);

  // const updateStorageData = (
  //   data: Offboard_asset[] | IBuyToStorage[],
  //   updateFn: (data: Offboard_asset[] | IBuyToStorage[]) => void,
  // ) => {
  //   let updatedData = Array.isArray(data) ? [...data] : [];

  //   updatedData = updatedData.map((item) => ({
  //     ...item,
  //     storageDuration:
  //       typeof storageDuration !== "object"
  //         ? storageDuration
  //         : storageDuration[item.id] || item.storageDuration,
  //     storeDate: Date.now(),
  //     actionType: "Store",
  //   }));
  //   dispatch(updateFn(updatedData));
  // };

  // const handleSubmit = () => {
  //   const equipmentDB = equipmentsData?.find((item) => item.id === equipID);
  //   const transform = transformData(equipmentDB as any) as Offboard_asset;

  //   const safeOffboardingData = Array.isArray(offboardingData)
  //     ? offboardingData
  //     : [];

  //   actionBuyToStorageInstance
  //     ?
  //       updateStorageData(
  //         onboardingBuytostorage,
  //         updateOnboardingBuytostorageData,
  //       )
  //     : !equipmentDB
  //       ? updateStorageData([...safeOffboardingData], updateOffboardingData)
  //       : updateStorageData(
  //           [...safeOffboardingData, transform],
  //           updateOffboardingData,
  //         );

  //   setStorageDuration({});
  //   onNext?.();
  //   onClose();
  // };

  const updateStorageData = <T extends Offboard_asset | IBuyToStorage>(
    data: T[],
    updateFn: (data: T[]) => any,
    storageDurationMap: Record<string, string | null> | undefined = {},
  ) => {
    const updatedData = data.map((item) => {
      const shouldUpdate = !item.actionType || item.actionType === "Store";

      if (!shouldUpdate) return item;

      const updatedDuration =
        storageDurationMap[item.id] ?? item.storageDuration;

      return {
        ...item,
        storageDuration: updatedDuration,
        ...(item.actionType !== "Store" && {
          storeDate: Date.now(),
          actionType: "Store" as const,
        }),
      };
    });

    dispatch(updateFn(updatedData));
  };

  const handleSubmit = () => {
    const equipmentDB = equipmentsData?.find((item) => item.id === equipID);
    const transform = transformData(equipmentDB as any) as Offboard_asset;

    const safeOffboardingData: Offboard_asset[] = Array.isArray(offboardingData)
      ? [...offboardingData]
      : offboardingData
        ? [offboardingData]
        : [];

    if (actionBuyToStorageInstance) {
      updateStorageData(
        onboardingBuytostorage,
        updateOnboardingBuytostorageData,
        storageDuration,
      );
    } else {
      const newData = equipmentDB
        ? [...safeOffboardingData, transform]
        : safeOffboardingData;

      updateStorageData(newData, updateOffboardingData, storageDuration);
    }

    setStorageDuration({});
    onNext?.();
    onClose();
  };

  const handleCancel = () => {
    const data = actionBuyToStorageInstance
      ? onboardingBuytostorage
      : offboardingData;
    const deleteAction = actionBuyToStorageInstance
      ? deleteOnboardingBuytostorageData
      : deleteOffboardingData;

    data?.forEach((item) => {
      if (item.statusFlow !== "Completed") {
        dispatch(deleteAction(item.id));
      }
    });
    setStorageDuration({});
    onClose();
  };

  const handleStorageDurationChange = (id: string, value: string) => {
    setStorageDuration((prev) => ({ ...prev, [id]: value }));
  };

  const isSubmitDisabled = useMemo(() => {
    if (!storageDuration) return true;
    const values = Object.values(storageDuration);
    const hasEmptyValue = values.some((value) => !value?.trim());

    const referenceLength = actionBuyToStorageInstance
      ? Array.isArray(onboardingBuytostorage)
        ? onboardingBuytostorage.length
        : 0
      : Array.isArray(offboardingData)
        ? offboardingData.filter(
            (item) => item?.actionType === "Store" || !item?.actionType,
          ).length
        : 0;

    return (
      values.length === 0 || hasEmptyValue || values.length < referenceLength
    );
  }, [
    storageDuration,
    onboardingBuytostorage,
    offboardingData,
    actionBuyToStorageInstance,
  ]);

  return (
    <div>
      <DrawerRight
        isOpen={isOpen}
        onClose={handleCancel}
        onCancel={handleCancel}
        onSave={handleSubmit}
        saveText={"Submit"}
        isSaveButtonDisabled={isSubmitDisabled}
        drawerTitle={!isEditable ? title || "Storage duration" : "Edit "}
        drawerDescription={
          !isEditable
            ? description ||
              "How long would you like to store the equipment for?"
            : "Please edit action details"
        }
        data-testid="storageduration-drawerright"
      >
        <PageState
          isLoading={(!isOpen || isLoading) as boolean}
          isError={isError as boolean}
        >
          {!isMultiple ? (
            // @ts-ignore
            <SingleInstance
              setStorageDuration={(value) =>
                handleStorageDurationChange(equip_id!, value)
              }
            />
          ) : (
            <MultipleInstance
              selectedValues={storageDuration as any}
              setSelectedValues={handleStorageDurationChange as any}
              offboardingData={
                !Boolean(actionBuyToStorageInstance)
                  ? (offboardingData as any)
                  : (onboardingBuytostorage as any)
              }
              actionBuyToStorageInstance={Boolean(actionBuyToStorageInstance)}
            />
          )}
        </PageState>
      </DrawerRight>
    </div>
  );
};

export default StorageDuration;
