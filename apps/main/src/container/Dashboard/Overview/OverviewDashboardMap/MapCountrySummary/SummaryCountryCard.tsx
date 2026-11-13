"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import NavigateButton from "@/components/NavigateButton";
import { ArrowRight } from "lucide-react";

interface Props {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  route: string;
}

const SummaryCountryCard: React.FC<Props> = ({
  description,
  icon,
  title,
  route,
}) => {
  return (
    <div className="h-full">
      <Card className="flex flex-row justify-between items-center p-3 border-[0.5px] border-gray-300">
        <div className="flex flex-row items-center gap-x-2 justify-start text-center ">
          <div className="">{icon}</div>
          <div className="flex flex-col text-black font-medium text-sm">
            {title}
            <span className="text-sm font-normal text-start">
              {description}
            </span>
          </div>
        </div>

        <div className="font-semibold text-[10px] text-white ">
          <NavigateButton href={route} data-testid="summarycountrycard-button">
            <ArrowRight className="w-4 text-white" />
          </NavigateButton>
        </div>
      </Card>
    </div>
  );
};

export default SummaryCountryCard;
