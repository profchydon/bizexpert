import React, { useEffect, useMemo, useState } from "react";
import DrawerRight from "@/components/DrawerRight";
import PageState from "@/components/PageState";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import MultipleInstanceDate from "./MultipleInstanceDate";
import SingleInstanceDate from "./SingleInstanceDate";
import { DatePicker } from "@/components/ui/date-picker";

export interface BaseItem {
  id: string;
  collectionDate?: string | Date;
  statusFlow?: "Completed" | null;
  actionType?: string;
}

interface Props<T extends BaseItem> {
  isOpen: boolean;
  baseRoute?: string;
  onClose: () => void;
  onNext?: () => void;
  equipID?: string | null;
  isEditable?: boolean;
  selectedRows?: { id: string }[];
  setSelectedRows?: () => void;
  isConfirmInstance?: boolean;
  data: T[];
  updateData: (data: T[]) => void;
  deleteItem?: (id: string) => void;
}

const CollectionDate = <T extends BaseItem>({
  isOpen,
  baseRoute,
  onClose,
  onNext,
  equipID,
  isEditable,
  selectedRows,
  setSelectedRows,
  isConfirmInstance,
  data,
  updateData,
  deleteItem,
}: Props<T>) => {
  const { push } = useTransitionRouter();

  const [dateMap, setDateMap] = useState<Record<string, Date>>({});
  const [collectionAllDate, setCollectionAllDate] = useState<Date | string>();

  // const isMultiple = Array.isArray(data);
  const isMultiple = !equipID && Array.isArray(data) && data.length > 1;
  const singleItemId = equipID || data[0]?.id || "";

  useEffect(() => {
    const initialMap: Record<string, Date> = {};
    data.forEach((item) => {
      if (item.collectionDate) {
        initialMap[item.id] = new Date(item.collectionDate);
      }
    });
    setDateMap(initialMap);
  }, [data]);

  const handleDateChange = (id: string, value: Date) => {
    setDateMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleAutoFillDate = (value: Date) => {
    const updatedDates: Record<string, Date> = {};
    data.forEach((item) => {
      updatedDates[item.id] = value;
    });
    setDateMap(updatedDates);
  };

  const handleSubmit = () => {
    const selectedIds = selectedRows?.map((row) => row.id) || [];

    const updated = data.map((item) => {
      return {
        ...item,
        collectionDate: dateMap[item.id] ?? item.collectionDate,
        statusFlow: "Completed",
      };
    });

    updateData(updated);
    setDateMap({});
    setSelectedRows?.();

    if (!isConfirmInstance) {
      onNext?.();
      if (baseRoute) push(baseRoute);
    }
    onClose();
  };

  const handleCancel = () => {
    setSelectedRows?.();
    if (baseRoute) push(baseRoute);
    onClose();
  };

  const isSubmitDisabled = useMemo(() => {
    // Must have collectionDate for every item in data
    return data.some((item) => {
      const date = dateMap[item.id];
      return !date || isNaN(new Date(date).getTime());
    });
  }, [dateMap, data]);

  return (
    <DrawerRight
      isOpen={isOpen}
      onClose={handleCancel}
      onCancel={handleCancel}
      onSave={handleSubmit}
      saveText="Submit"
      isSaveButtonDisabled={isSubmitDisabled}
      drawerTitle={!isEditable ? "Select date" : "Edit"}
      drawerDescription={
        !isEditable
          ? "Please select collection date(s) for the device(s)"
          : "Please edit action details"
      }
      data-testid="collectiondate-drawerright"
    >
      {/* <PageState isLoading={false} isError={false}>
        {isMultiple ? (
          <MultipleInstanceDate<T>
            data={data}
            selectedValues={dateMap}
            setSelectedValues={handleDateChange}
          />
        ) : (
          <SingleInstanceDate
            selectedDate={dateMap[equipID ?? ""] ?? null}
            setDate={(date) => handleDateChange(equipID ?? "", date)}
          />
        )}
      </PageState> */}
      <PageState isLoading={false} isError={false}>
        <div className="flex flex-col gap-3">
          {isMultiple && (
            <DatePicker
              className="w-full h-[44px]"
              placeHolder="Set same date for all"
              disablePastDates
              date={collectionAllDate as Date}
              setDate={(date: Date) => {
                setCollectionAllDate(date);
                handleAutoFillDate(date);
              }}
            />
          )}
          {isMultiple ? (
            <MultipleInstanceDate<T>
              data={data}
              selectedValues={dateMap}
              setSelectedValues={handleDateChange}
            />
          ) : (
            <SingleInstanceDate
              selectedDate={dateMap[singleItemId ?? ""] ?? null}
              setDate={(date) => handleDateChange(singleItemId ?? "", date)}
            />
          )}
        </div>
      </PageState>
    </DrawerRight>
  );
};

export default CollectionDate;
