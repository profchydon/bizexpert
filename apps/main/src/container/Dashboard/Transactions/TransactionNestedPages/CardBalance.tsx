import { card_balance_bg_image } from "@/assets/images";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { Progress } from "@/components/ui/progress";
import { pay_credit_icon } from "@/assets/icons";

const CardBalance = ({ currencySymbol = "$" }: { currencySymbol?: string }) => {
  const [progress, setProgress] = React.useState(60);
  return (
    <div className="relative  p-6 bg-customDarkGray rounded-lg">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-200 font-medium">Credit balance</p>
          <h1 className="text-4xl font-semibold text-white">
            {currencySymbol}2,420,833.00
          </h1>
          <div className="flex flex-row items-center gap-3 w-[20rem]">
            <Progress
              indicatorClassName="bg-gray-400"
              value={progress}
              className="w-full"
            />
            <p className="text-gray-50 text-sm font-medium w-full">
              {currencySymbol}4,000,000.00 (Limit)
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="mt-4 bg-white border-[1px] border-gray-300 text-gray-700 z-50"
          data-testid="cardbalance-button"
        >
          <Image
            src={pay_credit_icon}
            alt="pay_credit_icon"
            width={16.67}
            height={16.67}
            className="mr-1"
          />
          Pay credit
        </Button>
      </div>

      <div className="absolute inset-y-0 right-0 w-1/2 flex items-center z-10">
        <Image
          src={card_balance_bg_image}
          alt="card_balance_image"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </div>
  );
};

export default CardBalance;
