import { checkbox_gray_300, checkbox_primary_600 } from "@/assets/icons";
import { CardHeader } from "@/components/ui/card";
import Image from "next/image";
import React, { FC, memo } from "react";

interface SPFeatureHeaderProps {
  plan: string;
  description: string;
  price: string | number;
  currency?: string;
  selectedCardValue: string;
  id: string;
}
const SPFeatureHeader: FC<SPFeatureHeaderProps> = (props) => {
  const { plan, description, price, currency, selectedCardValue, id } = props;
  return (
    <CardHeader className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 pt-8 pb-6 sm:px-8 border-b-[1px] border-b-gray-200">
      <div className="flex flex-col items-start flex-1">
        <h4 className="text-gray-900 text-2xl font-semibold">{plan}</h4>
        <p className="text-gray-600 text-sm font-normal mt-1 text-start">
          {description}
        </p>
      </div>
      <div className="flex flex-row items-center gap-x-4">
        <p className="text-3xl font-semibold text-gray-900 mt-4 sm:mt-0 gap-x-0.5">
          <sup className="text-2xl empty:hidden mr-1">{currency}</sup>
          {price}
          <span className="text-base text-gray-600 font-normal empty:hidden ml-1 ">
            per year
          </span>
        </p>

        {selectedCardValue !== id ? (
          <Image
            src={checkbox_gray_300}
            alt="check_primary_icon"
            width={24}
            height={24}
          />
        ) : (
          <Image
            src={checkbox_primary_600}
            alt="check_primary_icon"
            width={24}
            height={24}
          />
        )}
      </div>
    </CardHeader>
  );
};

export default memo(SPFeatureHeader);
