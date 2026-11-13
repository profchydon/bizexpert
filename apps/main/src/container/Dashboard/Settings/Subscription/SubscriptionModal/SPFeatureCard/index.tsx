import React, { FC, memo } from "react";
import SPFeatureHeader from "./SPFeatureHeader";
import SPFeatures from "./SPFeatures";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IPlanFeatures } from "@/types/plans";

interface SPFeatureCard {
  plan: string;
  description: string;
  price: string | number;
  currency?: string;
  feature_description: string;
  data: IPlanFeatures[];
  id: string;
  selectedCardValue: string;
}

const SPFeatureCard: FC<SPFeatureCard> = (props) => {
  const {
    plan,
    id,
    description,
    price,
    currency,
    data,
    feature_description,
    selectedCardValue,
  } = props;

  return (
    <Card
      className={cn(
        "bg-white flex flex-col items-start w-full h-auto shadow-3xl rounded-2xl cursor-pointer self-stretch ",
        `${selectedCardValue === id && "border-primary-600 text-primary-700"}`,
      )}
    >
      <SPFeatureHeader
        plan={plan}
        description={description}
        price={price}
        currency={currency}
        selectedCardValue={selectedCardValue}
        id={id}
      />
      <CardContent className="px-4 pt-8 pb-9 sm:px-8 flex flex-col gap-6">
        <div className="flex flex-col items-start">
          <h4 className="text-gray-900 text-base font-semibold">FEATURES</h4>
        </div>
        <SPFeatures data={data} />
      </CardContent>
    </Card>
  );
};

export default memo(SPFeatureCard);
