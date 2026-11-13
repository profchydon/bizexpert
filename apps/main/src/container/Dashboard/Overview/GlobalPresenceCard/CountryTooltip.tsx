import type { ComponentType } from "react";
import { Laptop01, Safe } from "@untitledui/icons";
import type { CountryEntry } from "./types";

type CountryTooltipProps = {
  country: CountryEntry;
  x: number;
  y: number;
  FlagComponent?: ComponentType<{ className?: string }>;
};

export function CountryTooltip({
  country,
  x,
  y,
  FlagComponent,
}: CountryTooltipProps) {
  return (
    <div
      className="pointer-events-none absolute z-20 w-[294px] -translate-x-1/2 -translate-y-full"
      style={{ left: x, top: y - 12 }}
    >
      <div className="rounded-xl border border-border-secondary bg-primary p-4 shadow-md">
        <div className="flex flex-col items-center gap-2">
          {FlagComponent ? (
            <FlagComponent className="size-5 overflow-hidden rounded-sm" />
          ) : null}
          <p className="text-center text-xs font-semibold text-primary">
            {country.employees} Employees, {country.name}, {country.code}
          </p>
        </div>
        <div className="mt-2 flex justify-center gap-4">
          <span className="flex items-center gap-1.5 text-sm whitespace-nowrap text-quaternary">
            <Laptop01 className="size-4 shrink-0" />
            <span>
              <span className="font-semibold">({country.equipment})</span>{" "}
              Equipment
            </span>
          </span>
          <span className="flex items-center gap-1.5 text-sm whitespace-nowrap text-quaternary">
            <Safe className="size-4 shrink-0" />
            <span>
              <span className="font-semibold">({country.storage})</span> Items
              stored
            </span>
          </span>
        </div>
        <p className="mt-3 text-center text-sm font-semibold text-tertiary">
          Click for More Info
        </p>
      </div>
      <div className="mx-auto -mt-px h-2 w-4 overflow-hidden">
        <div className="mx-auto size-3 -translate-y-1/2 rotate-45 border-r border-b border-border-secondary bg-primary" />
      </div>
    </div>
  );
}
