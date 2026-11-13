import type { EmployeeSelection } from "./types";

export type SelectionTabKey = "REVIEW" | "APPROVED";

export function getEmployeeSelectionGroups(
  selections: EmployeeSelection[],
  search: string,
) {
  const normalizedSearch = search.trim().toLowerCase();
  const searched = normalizedSearch
    ? selections.filter((selection) =>
        selection.employeeName.toLowerCase().includes(normalizedSearch),
      )
    : selections;

  return {
    searched,
    approved: searched.filter((selection) => selection.status === "APPROVED"),
    inReview: searched.filter((selection) => selection.status !== "APPROVED"),
  };
}

export function formatSelectionSubmitted(value: string) {
  const date = new Date(value);
  return `${date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  })} · ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function formatSelectionSubmittedFull(value: string) {
  const date = new Date(value);
  return `${date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} · ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
