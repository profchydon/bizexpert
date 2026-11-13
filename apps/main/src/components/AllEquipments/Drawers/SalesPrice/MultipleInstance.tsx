import React, { FC } from "react";
import SalesPriceCard from "./SalesPriceCard";
import { Offboard_asset } from "@/types/offboarding";

interface Props {
  offboardingData: Offboard_asset[];
  resaleValueDB: any;
  currency_symbol: string;
}
const MultipleInstance: FC<Props> = ({
  offboardingData,
  resaleValueDB,
  currency_symbol,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {offboardingData?.map((item) => {
        if (item?.actionType === "Sale" || !item?.actionType) {
          const extimatedPrice = resaleValueDB?.[item?.id] as any;
          return (
            <SalesPriceCard
              name={`${item?.title} ${item?.make} (${item?.year})`}
              estimatedPrice={`${currency_symbol || ""}${extimatedPrice || ""}`}
              key={item?.id}
            />
          );
        }
      })}
    </div>
  );
};

export default MultipleInstance;
