import type { SortDescriptor } from "react-aria-components";
import type { SoftwareItem } from "../types";

// "Last run" sorts by recency, not alphabetically, so "2 minutes ago" beats "88 days ago".
// The label is prose, so the ordering has to come from parsing it back to days.
function recencyDays(label: string): number {
  if (label === "Running now") return -1;
  const value = Number(label.replace(/[^0-9]/g, "")) || 0;
  if (label.includes("minute")) return value / 1440;
  if (label.includes("hour")) return value / 24;
  return value;
}

const USAGE_RANK = { active: 0, occasional: 1, unused: 2 } as const;

export function filterApps(
  apps: SoftwareItem[],
  query: string,
): SoftwareItem[] {
  const q = query.trim().toLowerCase();
  return q ? apps.filter((app) => app.name.toLowerCase().includes(q)) : apps;
}

export function sortApps(
  apps: SoftwareItem[],
  sort: SortDescriptor,
): SoftwareItem[] {
  if (!sort.column) return apps;
  const dir = sort.direction === "descending" ? -1 : 1;
  return [...apps].sort((a, b) => {
    switch (sort.column) {
      case "version":
        return (
          dir * a.version.localeCompare(b.version, undefined, { numeric: true })
        );
      case "installed":
        return dir * a.installedLabel.localeCompare(b.installedLabel);
      case "lastRun":
        return (
          dir * (recencyDays(a.lastRunLabel) - recencyDays(b.lastRunLabel))
        );
      case "usage":
        return dir * (USAGE_RANK[a.usage] - USAGE_RANK[b.usage]);
      default:
        return dir * a.name.localeCompare(b.name);
    }
  });
}
