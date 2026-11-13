"use client";

import { DetailCard } from "../DetailCard";

// A preview beats a promise. Same layout the tab renders once the agent reports, greyed
// and labelled so it is never mistaken for a reading from this device.
const TILES = [
  { label: "Battery capacity", sub: "Cycle count against rated life." },
  { label: "Storage used", sub: "Free space against the disk." },
  { label: "Memory pressure", sub: "With the applications driving it." },
];

export function ReadingsPreview() {
  return (
    <DetailCard
      title="What appears once it is running"
      action={
        <span className="text-sm text-tertiary">Sample, not this device</span>
      }
    >
      <div
        aria-hidden="true"
        className="grid grid-cols-1 gap-2.5 opacity-40 select-none sm:grid-cols-3"
      >
        {TILES.map((tile) => (
          <div
            key={tile.label}
            className="flex flex-col rounded-xl border border-secondary bg-secondary p-3.5"
          >
            <span className="text-xs text-quaternary">{tile.label}</span>
            <span className="mt-1 text-display-xs font-semibold text-primary">
              —
            </span>
            <p className="mt-1 text-sm text-tertiary">{tile.sub}</p>
            <span className="mt-3 h-10 rounded-md border border-dashed border-secondary" />
          </div>
        ))}
      </div>
    </DetailCard>
  );
}
