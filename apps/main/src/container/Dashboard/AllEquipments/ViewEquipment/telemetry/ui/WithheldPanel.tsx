"use client";

import { EmptyState } from "@/components/application/empty-state/empty-state";

// A section that simply vanished would read as a device with nothing installed and nothing
// running, so each withheld panel states its own reason.
//
// `Header` and `Content` are skipped deliberately: they render <header> and <main>, which
// are landmark elements and wrong nested inside a card. The title drops to h3 so it sits
// under the card's own h2 rather than announcing itself as a fourth page heading.
export function WithheldPanel({
  title,
  hint,
  heading,
  reason,
}: {
  title: string;
  hint: string;
  heading: string;
  reason: string;
}) {
  return (
    <section className="rounded-xl border border-secondary bg-primary shadow-xs">
      <div className="flex items-center justify-between gap-3 border-b border-secondary px-5 py-3.5">
        <h2 className="text-md font-semibold text-primary">{title}</h2>
        <span className="text-sm text-tertiary">{hint}</span>
      </div>
      <div className="px-5 py-6">
        <EmptyState size="sm">
          <EmptyState.Illustration type="cloud" color="gray" />
          <div className="mt-3 flex flex-col items-center gap-1">
            <EmptyState.Title as="h3">{heading}</EmptyState.Title>
            <EmptyState.Description>{reason}</EmptyState.Description>
          </div>
        </EmptyState>
      </div>
    </section>
  );
}
