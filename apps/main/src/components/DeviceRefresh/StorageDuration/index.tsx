import React, { useEffect, useMemo, useState } from "react";
import DrawerRight from "@/components/DrawerRight";
import PageState from "@/components/PageState";
import SingleInstance from "./SingleInstance";
import MultipleInstance from "./MultipleInstance";

interface StorageItemBase {
  id: string;
  storageDuration?: string;
  actionType?: string;
  storeDate?: string | number;
  statusFlow?: "Completed" | null;
}

interface StorageDurationProps<T extends StorageItemBase> {
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  title?: string;
  description?: string;
  equipID?: string | null;
  isLoading?: boolean;
  isError?: boolean;
  isEditable?: boolean;
  isBuyToStorage?: boolean;
  equipmentsData?: { id: string }[];
  dataInstance: T[];
  updateData: (data: T[]) => any;
  deleteItem?: (id: string) => any;
  transformItem?: (item: any) => T;
}

const StorageDuration = <T extends StorageItemBase>({
  isOpen,
  onClose,
  onNext,
  title,
  description,
  equipID,
  isLoading,
  isError,
  isEditable,
  isBuyToStorage = false,
  equipmentsData,
  dataInstance,
  updateData,
  deleteItem,
  transformItem,
}: StorageDurationProps<T>) => {
  const [storageDuration, setStorageDuration] = useState<
    Record<string | number, string>
  >({});
  const isMultiple = Array.isArray(dataInstance) && dataInstance.length > 0;

  useEffect(() => {
    const durationMap: Record<string, string> = dataInstance.reduce(
      (acc, item) => {
        if (item?.storageDuration) acc[item.id] = item.storageDuration;
        return acc;
      },
      {} as Record<string, string>,
    );
    setStorageDuration(durationMap);
  }, [dataInstance]);

  const updateStorageData = (
    data: T[],
    durationMap: Record<string, string | null> = {},
  ) => {
    const updated = data.map((item) => {
      //   const shouldUpdate = !item.actionType || item.actionType === "Store";
      //   if (!shouldUpdate) return item;

      return {
        ...item,
        storageDuration: durationMap[item.id] ?? item.storageDuration,
        storeDate: Date.now(),
      };
    });
    updateData(updated);
  };

  const handleSubmit = () => {
    const equipment = equipmentsData?.find((item) => item.id === equipID);
    const transformed = transformItem?.(equipment) as T;

    const newData =
      equipment && transformed ? [...dataInstance, transformed] : dataInstance;
    updateStorageData(newData, storageDuration);
    setStorageDuration({});
    onNext?.();
    onClose();
  };

  const handleCancel = () => {
    // dataInstance.forEach((item) => {
    //   if (item.statusFlow !== "Completed") deleteItem?.(item.id);
    // });
    setStorageDuration({});
    onClose();
  };

  const handleStorageDurationChange = (id: string | number, value: string) => {
    setStorageDuration((prev) => ({ ...prev, [id]: value }));
  };

  const isSubmitDisabled = useMemo(() => {
    if (!storageDuration) return true;
    const values = Object.values(storageDuration);
    const hasEmpty = values.some((v) => !v?.trim());

    const expectedLength = dataInstance.filter(
      (item) => !item?.actionType,
    ).length;

    return values.length === 0 || hasEmpty || values.length < expectedLength;
  }, [storageDuration, dataInstance]);

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={handleCancel}
      onCancel={handleCancel}
      onSave={handleSubmit}
      saveText={"Submit"}
      isSaveButtonDisabled={isSubmitDisabled}
      drawerTitle={!isEditable ? title || "Storage duration" : "Edit"}
      drawerDescription={
        !isEditable
          ? description || "How long would you like to store the equipment for?"
          : "Please edit action details"
      }
      data-testid="storageduration-drawerright"
    >
      <PageState
        isLoading={(!isOpen || isLoading) as boolean}
        isError={isError as boolean}
      >
        {!isMultiple ? (
          <SingleInstance
            setStorageDuration={(val) =>
              handleStorageDurationChange(equipID!, val)
            }
            defaultValue={storageDuration?.[equipID!] || ""}
          />
        ) : (
          <MultipleInstance<T>
            selectedValues={Object.fromEntries(
              Object.entries(storageDuration).map(([key, val]) => [
                key,
                val ?? "",
              ]),
            )}
            setSelectedValues={handleStorageDurationChange}
            data={dataInstance}
            showDescription={!isBuyToStorage}
          />
        )}
      </PageState>
    </DrawerRight>
  );
};

export default StorageDuration;
