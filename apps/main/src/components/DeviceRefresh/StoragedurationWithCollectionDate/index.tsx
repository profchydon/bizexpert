import React, { useEffect, useMemo, useState } from "react";
import DrawerRight from "@/components/DrawerRight";
import PageState from "@/components/PageState";
import StorageDurationSingleInstance from "../StorageDuration/SingleInstance";
import CollectionDateSingleInstance from "../CollectionDate/SingleInstanceDate";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/store";
import { useSearchParams } from "next/navigation";
import { IRefreshDevice } from "@/types/refreshDevice";

interface StorageItemBase {
  id: string;
  storageDuration?: string;
  collectionDate?: string | Date;
  actionType?: string;
  storeDate?: string | number;
  statusFlow?: "Completed" | null;
}

interface Props<T extends StorageItemBase> {
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
  isError?: boolean;
  isEditable?: boolean;
  equipmentsData?: { id: string }[];
  dataInstance: T[];
  updateData: (data: T[]) => any;
  hideNote?: boolean;
}

const StoragedurationWithCollectionDate = <T extends StorageItemBase>({
  isOpen,
  onClose,
  onNext,
  title,
  description,
  isLoading,
  isError,
  isEditable,
  dataInstance,
  updateData,
  hideNote = false,
}: Props<T>) => {
  const params = useSearchParams();
  const isDeviceRefreshSingleInstance = Boolean(params.get("single-instance"));
  const singleEquipmentData = dataInstance?.[0];
  const equipmentId = singleEquipmentData?.id as string;
  const [storageDuration, setStorageDuration] = useState<
    Record<string | number, string>
  >({});
  const [collectionDate, setCollectionDate] = useState<Record<string, Date>>(
    {},
  );
  const [addNote, setAddNote] = useState<string>();
  const isDispose =
    isDeviceRefreshSingleInstance &&
    singleEquipmentData?.actionType === "Dispose";
  const refreshDeviceItems = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.refreshDeviceItems,
  ) as IRefreshDevice[];

  useEffect(() => {
    const durationMap: Record<string, string> = dataInstance?.reduce(
      (acc, item) => {
        if (item?.storageDuration) acc[item.id] = item.storageDuration;
        return acc;
      },
      {} as Record<string, string>,
    );
    setStorageDuration(durationMap);
  }, [dataInstance]);

  useEffect(() => {
    const initialMap: Record<string, Date> = {};
    dataInstance?.forEach((item) => {
      if (item.collectionDate) {
        initialMap[item.id] = new Date(item.collectionDate);
      }
    });
    setCollectionDate(initialMap);
  }, [dataInstance]);

  const updateStorageData = (
    data: T[],
    durationMap: Record<string, string | null> = {},
  ) => {
    const updated = data.map((item) => {
      return {
        ...item,
        ...(item.actionType !== "Dispose" && {
          storageDuration: 3,
          // storageDuration: durationMap[item.id] ?? item.storageDuration,
        }),
        ...(isDeviceRefreshSingleInstance && {
          items: [...refreshDeviceItems],
        }),
        ...(!hideNote &&
          addNote && {
            note: addNote,
          }),
        collectionDate: collectionDate[item.id] ?? item.collectionDate,
        storeDate: Date.now(),
      };
    });

    updateData(updated);
  };
  const handleSubmit = () => {
    updateStorageData(dataInstance, storageDuration);
    setStorageDuration({});
    setCollectionDate({});
    setAddNote("");
    onNext?.();
    onClose();
  };

  const handleCancel = () => {
    setStorageDuration({});
    onClose();
  };

  const handleStorageDurationChange = (id: string | number, value: string) => {
    setStorageDuration((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (id: string, value: Date) => {
    setCollectionDate((prev) => ({ ...prev, [id]: value }));
  };

  const isSubmitDisabled = useMemo(() => {
    if (!singleEquipmentData) return true;

    const id = singleEquipmentData.id;

    // Always require collection date
    const hasCollectionDate = !!collectionDate[id];

    // Only require storageDuration if not "Dispose"
    // const hasStorageDuration = isDispose || !!storageDuration?.[id]?.trim();

    // return !hasCollectionDate || !hasStorageDuration;
    return !hasCollectionDate;
  }, [singleEquipmentData, storageDuration, collectionDate]);

  const drawerTitle = !isEditable
    ? isDispose
      ? "Collection start date"
      : title || "Storage duration"
    : "Edit";

  const drawerDescription = !isEditable
    ? isDispose
      ? "When do you want collection to start?"
      : description || "How long would you like to store the equipment for?"
    : "Please edit action details";

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={handleCancel}
      onCancel={handleCancel}
      onSave={handleSubmit}
      saveText={"Submit"}
      isSaveButtonDisabled={isSubmitDisabled}
      drawerTitle={drawerTitle}
      drawerDescription={drawerDescription}
      data-testid="storagedurationwithcollectiondate-drawerright"
    >
      <PageState
        isLoading={(!isOpen || isLoading) as boolean}
        isError={isError as boolean}
      >
        <div>
          {/* {!isDispose && (
            <StorageDurationSingleInstance
              setStorageDuration={(val) =>
                handleStorageDurationChange(equipmentId!, val)
              }
              defaultValue={storageDuration?.[equipmentId!] || ""}
            />
          )} */}

          <CollectionDateSingleInstance
            selectedDate={collectionDate[equipmentId ?? ""] ?? null}
            setDate={(date) => handleDateChange(equipmentId ?? "", date)}
          />

          {!hideNote && (
            <div className="flex flex-col gap-3 mt-4">
              <p className="text-sm font-medium">Add note</p>
              <Textarea
                className="min-h-[154px]"
                value={addNote}
                placeholder="Enter a additional instructions..."
                onChange={(e) => {
                  setAddNote?.(e.target.value);
                }}
              />
            </div>
          )}
        </div>
      </PageState>
    </DrawerRight>
  );
};

export default StoragedurationWithCollectionDate;
