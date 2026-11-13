"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ALL_COUNTRIES, CountrySidebar } from "./CountrySidebar";
import type { CountryEntry, TooltipState } from "./types";

const WorldMap = dynamic(
  () => import("./WorldMap").then((module) => module.WorldMap),
  { ssr: false },
);

type GlobalPresenceCardProps = {
  data: CountryEntry[];
};

export function GlobalPresenceCard({ data }: GlobalPresenceCardProps) {
  const [selectedCode, setSelectedCode] = useState<string>(
    data.length === 1 && data[0] ? data[0].code : ALL_COUNTRIES,
  );
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const focusCode = selectedCode === ALL_COUNTRIES ? null : selectedCode;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border-secondary bg-primary">
      <WorldMap
        data={data}
        focusCode={focusCode}
        tooltip={tooltip}
        onHover={setTooltip}
        onSelect={(code) => {
          setSelectedCode(code);
          setTooltip(null);
        }}
      />
      <div className="absolute top-4 right-4 bottom-4 hidden w-[300px] md:block">
        <CountrySidebar
          data={data}
          selectedCode={selectedCode}
          onSelect={setSelectedCode}
        />
      </div>
    </div>
  );
}
