import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import HeadingCard from "./HeadingCard";
import MapCountrySummary from "../MapCountrySummary";
import CountrySelectCard from "./CountrySelectCard";

const CountrySelectMap = () => {
  return (
    <Card className="relative z-10 mr-0 w-full p-0 pt-4 md:absolute md:right-2 md:top-6 md:mr-3 md:h-[490px] md:w-[350px]">
      <CardContent className="flex h-full flex-col gap-4 pt-4 md:max-h-[490px]">
        <HeadingCard />
        <CountrySelectCard />
        <div className="flex-1 pr-1 overflow-y-auto">
          <MapCountrySummary />
        </div>
      </CardContent>
    </Card>
  );
};

export default CountrySelectMap;
