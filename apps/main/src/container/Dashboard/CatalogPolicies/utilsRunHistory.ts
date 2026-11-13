import type { RuleRunEntry, RunOutcome } from "./types";

export type RunOutcomeFilter = RunOutcome | "ALL";

export function filterRunHistoryEntries({
  entries,
  search,
  outcome,
}: {
  entries: RuleRunEntry[];
  search: string;
  outcome: RunOutcomeFilter;
}) {
  const normalizedSearch = search.trim().toLowerCase();
  return entries.filter((entry) => {
    const matchesSearch =
      !normalizedSearch ||
      entry.employeeName.toLowerCase().includes(normalizedSearch);
    const matchesOutcome = outcome === "ALL" || entry.outcome === outcome;
    return matchesSearch && matchesOutcome;
  });
}

export function formatRunOutcome(outcome: RunOutcome) {
  return outcome
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatRunHistoryTime(value: string) {
  const date = new Date(value);
  return `${date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  })} ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
