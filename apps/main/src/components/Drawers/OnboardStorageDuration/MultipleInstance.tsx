import React, { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICart } from "@/types/cart";
import EquipmentWrapper from "@/components/AllEquipments/Drawers/EquipmentWrapper";

interface Props {
  selectedValues: Record<number | string, string>;
  setSelectedValues: (id: number, value: string) => void;
  storageItems: ICart[];
}
const MultipleInstance: FC<Props> = ({
  selectedValues,
  setSelectedValues,
  storageItems,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {storageItems?.map((item) => {
        return (
          <EquipmentWrapper
            name={`${item?.asset?.name}`}
            key={item?.pricing?.id}
            quantity={item?.quantity}
            image={item?.images?.[0]!}
          >
            <div className="w-full">
              <Select
                value={selectedValues?.[item?.pricing?.id!] || ""}
                onValueChange={(value) =>
                  setSelectedValues(item?.pricing?.id as any, value)
                }
                data-testid="multipleinstance-select"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Storage duration" />
                </SelectTrigger>

                <SelectContent className="z-[210]">
                  {["1 Months", "3 Months", "6 Months", "12 Months"].map(
                    (value) => (
                      <SelectItem value={value} key={value}>
                        {`${value}`}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </EquipmentWrapper>
        );
      })}
    </div>
  );
};

export default MultipleInstance;
