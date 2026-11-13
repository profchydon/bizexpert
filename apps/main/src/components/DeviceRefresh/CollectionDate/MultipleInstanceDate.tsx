import React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import EquipmentWrapper from "@/components/AllEquipments/Drawers/EquipmentWrapper";

interface EquipmentBase {
  id: string | number;
  title?: string;
  image_url?: string;
  actionType?: string;
  specification?: {
    properties?: { value?: string }[];
  };
  [key: string]: any;
}

interface Props<T extends EquipmentBase> {
  data: T[];
  selectedValues: Record<string, Date>;
  setSelectedValues: (id: string, value: Date) => void;
}

const MultipleInstanceDate = <T extends EquipmentBase>({
  data,
  selectedValues,
  setSelectedValues,
}: Props<T>) => {
  return (
    <div className="flex flex-col gap-3">
      {data.map((item) => (
        <EquipmentWrapper
          key={item.id}
          name={item?.["title"] ?? ""}
          image={item?.["image_url"]}
          description=""
        >
          <DatePicker
            className="w-full h-[44px]"
            date={selectedValues[item.id] as Date}
            placeHolder="Select date"
            disablePastDates
            setDate={(date) => setSelectedValues(item?.id as any, date)}
          />
        </EquipmentWrapper>
      ))}
    </div>
  );
};

export default MultipleInstanceDate;
