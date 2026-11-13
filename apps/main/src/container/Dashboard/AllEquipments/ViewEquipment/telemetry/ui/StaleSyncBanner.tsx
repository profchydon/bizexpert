"use client";

import { ClockRefresh } from "@untitledui/icons";
import { Banner } from "@/components/application/alerts/banner";

// A stale device must not read as its last known good state (PRD section 6): this
// banner sits above every reading so the admin knows the data below is old.
export function StaleSyncBanner({ daysSinceSync }: { daysSinceSync: number }) {
  return (
    <Banner
      tone="warning"
      icon={ClockRefresh}
      title={`This device has not synced in ${daysSinceSync} days`}
      description="The readings below are from its last check-in and may no longer be accurate."
    />
  );
}
