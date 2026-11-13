import type { BadgeColors } from "@/components/base/badges/badge-types";
import type { Grade } from "./types";

/** Best to worst. Use for grade filters, legends, and pickers. */
export const GRADE_ORDER: Grade[] = ["A", "B", "C", "D"];

export const GRADE_LABELS: Record<Grade, string> = {
  A: "Excellent",
  B: "Good",
  C: "Fair",
  D: "Poor",
};

export const GRADE_COLOR: Record<Grade, BadgeColors> = {
  A: "success",
  B: "blue",
  C: "warning",
  D: "error",
};

/** Text colour per grade, for dense rows where a badge would be too loud. */
export const GRADE_TEXT_CLASS: Record<Grade, string> = {
  A: "text-utility-success-700",
  B: "text-utility-blue-700",
  C: "text-utility-warning-700",
  D: "text-utility-error-700",
};

/** Solid utility-token background classes for grade dots. */
export const GRADE_DOT_CLASS: Record<Grade, string> = {
  A: "bg-utility-success-500",
  B: "bg-utility-blue-500",
  C: "bg-utility-warning-500",
  D: "bg-utility-error-500",
};

export const GRADE_TOOLTIP: Record<Grade, string> = {
  A: "Excellent, like-new. Deploy without hesitation.",
  B: "Good, minor wear. Safe to deploy as-is.",
  C: "Fair, visible cosmetic wear. Consider a fresh check before a senior-hire deployment.",
  D: "Poor, heavy wear or functional concerns. Best candidate for disposal or buyback.",
};
