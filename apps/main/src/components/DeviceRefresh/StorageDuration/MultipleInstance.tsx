import React, { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  selectedValues: Record<string | number, string>;
  setSelectedValues: (id: string | number, value: string) => void;
  data: T[];
  showDescription?: boolean;
}

const MultipleInstance = <T extends EquipmentBase>({
  selectedValues,
  setSelectedValues,
  data,
  showDescription = true,
}: Props<T>) => {
  return (
    <div className="flex flex-col gap-3">
      {data?.map((item) => {
        const rawDescription =
          item?.specification?.properties
            ?.map((prop) => prop?.value)
            ?.filter(Boolean)
            ?.join(" ") || "";

        const description =
          showDescription && rawDescription
            ? rawDescription.slice(0, 29) +
              (rawDescription.length > 29 ? "..." : "")
            : "";

        return (
          <EquipmentWrapper
            name={item?.title || ""}
            key={item?.id}
            image={item?.image_url}
            description={description}
          >
            <div className="w-full">
              <Select
                value={selectedValues?.[item.id] || ""}
                onValueChange={(value) => setSelectedValues(item.id, value)}
                data-testid="multipleinstance-select"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Storage duration" />
                </SelectTrigger>

                <SelectContent className="z-[210]">
                  {["1", "3", "6", "12"].map((value) => (
                    <SelectItem value={value} key={value}>
                      {`${value} months`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </EquipmentWrapper>
        );

        return null;
      })}
    </div>
  );
};

export default MultipleInstance;
