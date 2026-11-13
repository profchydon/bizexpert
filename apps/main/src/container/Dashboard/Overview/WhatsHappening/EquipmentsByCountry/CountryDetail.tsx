import { Line } from "rc-progress";
import React from "react";
import lookup from "country-code-lookup";
import { getEmojiFlag } from "countries-list";
import Image from "next/image";
import { rectangle } from "@/assets/images";

interface Props {
  counts: number;
  name: string;
  percentage: string;
}

function capitalizeWords(sentence: string) {
  return sentence?.replace(/\b\w/g, function (match) {
    return match.toUpperCase();
  });
}

const CountryDetail: React.FC<Props> = ({ counts, name, percentage }) => {
  const isoCode = lookup.byCountry(capitalizeWords(name));
  const flag = getEmojiFlag(isoCode?.iso2 as any);

  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-4">
      {name?.toLowerCase() === "unassigned" ? (
        <Image src={rectangle} alt="img" />
      ) : (
        flag
      )}
      <div className="flex flex-col gap-y-[0.125rem]">
        <span className="text-gray-600 font-medium text-sm">
          <span className="capitalize">{name}</span> ({counts} assets)
        </span>
        <div className="flex items-center gap-x-3">
          <Line
            percent={Number(percentage)}
            trailColor="#EAECF0"
            strokeColor="#004CCC"
            trailWidth={6}
            strokeWidth={6}
          />

          <span className="text-gray-700 text-sm font-medium">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
