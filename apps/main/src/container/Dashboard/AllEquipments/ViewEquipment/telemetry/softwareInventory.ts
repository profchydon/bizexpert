import { dateLabel, seedFor } from "./historyWindow";
import type { AppUsage, SoftwareItem } from "./types";

// Base catalog the mock inventory draws from. Two Chrome PWAs demonstrate the PRD
// requirement that browser-installed web apps are tagged apart from native software.
const CATALOG: { name: string; version: string; isPwa?: boolean }[] = [
  { name: "Rayda Agent", version: "2.4.1" },
  { name: "1Password", version: "8.10.56" },
  { name: "Adobe Acrobat Reader", version: "24.3.0" },
  { name: "Docker Desktop", version: "4.36.0" },
  { name: "Figma", version: "124.7.4", isPwa: true },
  { name: "GitHub Desktop", version: "3.4.6" },
  { name: "Google Chrome", version: "131.0.6778" },
  { name: "Google Drive", version: "97.0.3" },
  { name: "Linear", version: "1.28.0", isPwa: true },
  { name: "Microsoft Excel", version: "16.90" },
  { name: "Microsoft Outlook", version: "16.90" },
  { name: "Microsoft Teams", version: "24.193.1" },
  { name: "Microsoft Word", version: "16.90" },
  { name: "Notion", version: "4.3.1", isPwa: true },
  { name: "Parallels Desktop", version: "20.1.0" },
  { name: "Postman", version: "11.11.0" },
  { name: "Slack", version: "4.41.98" },
  { name: "Spotify", version: "1.2.52" },
  { name: "TablePlus", version: "6.1.2" },
  { name: "Visual Studio Code", version: "1.95.3" },
  { name: "Zoom Workplace", version: "6.2.6" },
  { name: "Amphetamine", version: "5.3.1" },
  { name: "Bitwarden", version: "2024.10.1" },
  { name: "CleanMyMac", version: "5.0.2" },
  { name: "Cursor", version: "0.42.4" },
  { name: "Dropbox", version: "212.4.5478" },
  { name: "Fantastical", version: "3.8.14" },
  { name: "Grammarly", version: "1.94.0" },
  { name: "HP Smart", version: "16.10.1" },
  { name: "iStat Menus", version: "6.73" },
  { name: "Java Runtime", version: "8.0.4210" },
  { name: "Keka", version: "1.4.4" },
  { name: "LastPass", version: "4.129.0" },
  { name: "Loom", version: "0.226.0", isPwa: true },
  { name: "Miro", version: "0.10.60", isPwa: true },
  { name: "Node.js", version: "22.11.0" },
  { name: "OneDrive", version: "24.201.1" },
  { name: "Rectangle", version: "0.86" },
  { name: "Sketch", version: "101.3" },
  { name: "TeamViewer", version: "15.58.4" },
  { name: "Todoist", version: "9.7.0", isPwa: true },
  { name: "VLC", version: "3.0.21" },
  { name: "WhatsApp", version: "2.24.20" },
  { name: "Windows Terminal", version: "1.21.2" },
  { name: "WinRAR", version: "7.10" },
];

const RUN_LABELS = [
  "Running now",
  "2 minutes ago",
  "1 hour ago",
  "3 hours ago",
  "5 hours ago",
  "1 day ago",
];
const OCCASIONAL_RUNS = [2, 6, 11, 19, 34, 47];
const UNUSED_RUNS = [62, 71, 88, 104];

function runFor(usage: AppUsage, s: number): string {
  if (usage === "active") return RUN_LABELS[s % RUN_LABELS.length];
  if (usage === "occasional")
    return `${OCCASIONAL_RUNS[s % OCCASIONAL_RUNS.length]} days ago`;
  return `${UNUSED_RUNS[s % UNUSED_RUNS.length]} days ago`;
}

// Weighted so most software is in active use and a handful is not. The unused tail is the
// point of the column: installed, still licensed, not opened in two months.
function usageFor(s: number): AppUsage {
  const r = s % 10;
  if (r < 6) return "active";
  if (r < 8) return "occasional";
  return "unused";
}

// Deterministic per device id. Large enough to exercise the pagination footer, which is
// the reason the card takes one rather than a scroll box.
export function getSoftwareInventory(id: string): SoftwareItem[] {
  const n = Number(id) || id.length;
  // Never longer than the catalog: repeating an entry would print the same application
  // twice, which reads as a bug rather than as a real inventory.
  const count = Math.min(CATALOG.length, 34 + (n % 9));
  return CATALOG.slice(0, count)
    .map((base) => {
      const s = seedFor(id, base.name);
      // The agent itself is always running; nothing else is assumed.
      const usage: AppUsage =
        base.name === "Rayda Agent" ? "active" : usageFor(s);
      return {
        name: base.name,
        version: base.version,
        isPwa: Boolean(base.isPwa),
        installedLabel: dateLabel(30 + (s % 400)),
        lastRunLabel:
          base.name === "Rayda Agent" ? "Running now" : runFor(usage, s),
        usage,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const USAGE_LABEL: Record<AppUsage, string> = {
  active: "Active",
  occasional: "Occasional",
  unused: "Dormant",
};

export const USAGE_TOOLTIP: Record<AppUsage, string> = {
  active: "Run within the last 7 days.",
  occasional: "Run in the last 60 days, but not the last 7.",
  unused:
    "Not run in more than 60 days. A candidate for licence reclamation, not a fault.",
};
