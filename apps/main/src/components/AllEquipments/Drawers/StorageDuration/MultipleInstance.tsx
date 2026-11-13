import React, { FC } from "react";
import EquipmentWrapper from "../EquipmentWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Offboard_asset } from "@/types/offboarding";
import { IBuyToStorage } from "@/types/buytostorage";

interface Props {
  selectedValues: Record<number | string, string>;
  setSelectedValues: (id: number, value: string) => void;
  offboardingData: Offboard_asset[] | IBuyToStorage[];
  actionBuyToStorageInstance?: boolean;
}
const MultipleInstance: FC<Props> = ({
  selectedValues,
  setSelectedValues,
  offboardingData,
  actionBuyToStorageInstance,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {offboardingData?.map((item) => {
        if (item?.actionType === "Store" || !item?.actionType) {
          // @ts-ignore
          const description =
            actionBuyToStorageInstance &&
            // @ts-ignore
            item?.specification?.properties
              // @ts-ignore
              ?.map((prop) => prop?.value)
              .join(" ")
              .slice(0, 29) +
              // @ts-ignore
              (item?.specification?.properties
                // @ts-ignore
                ?.map((prop) => prop?.value)
                ?.join(" ").length > 29
                ? "..."
                : "");
          return (
            <EquipmentWrapper
              name={`${item?.title || ""}`}
              key={item?.id}
              image={item?.image_url}
              description={description || ""}
            >
              <div className="w-full">
                <Select
                  value={selectedValues?.[item?.id] || ""}
                  onValueChange={(value) =>
                    setSelectedValues(item?.id as any, value)
                  }
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
        }
      })}
    </div>
  );
};

export default MultipleInstance;
