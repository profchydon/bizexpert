"use client";

import { DetailCard } from "../DetailCard";

// Three full cards, each with an illustration and a heading, spent a third of the personal
// device page saying a version of "not collected". It is one idea, so it is stated once.
//
// This is also where the "never collected" line lives. It was lost when the scope banner
// came out, and it is the strongest privacy claim the product makes: not "we do not read
// your app list" but "the agent is not a surveillance tool".
const WITHHELD = [
  { what: "Installed applications", why: "Personal software is not read." },
  { what: "Per app memory", why: "Only the aggregate figure shown above." },
  {
    what: "Disk usage and its contents",
    why: "Capacity and files stay private.",
  },
  { what: "Battery and hardware", why: "The employee owns the device." },
];

export function NotCollectedCard() {
  return (
    <DetailCard
      title="Not collected on this device"
      action={<span className="text-sm text-tertiary">Personal device</span>}
    >
      <ul className="flex flex-col divide-y divide-border-secondary">
        {WITHHELD.map((row) => (
          <li
            key={row.what}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5 first:pt-0 last:pb-0"
          >
            <span className="text-sm font-medium text-primary">{row.what}</span>
            <span className="text-sm text-tertiary">{row.why}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3.5 border-t border-secondary pt-3 text-sm text-tertiary">
        Location, browsing, files, messages, keystrokes and screen contents are
        never collected, on a personal device or a company one.
      </p>
    </DetailCard>
  );
}
