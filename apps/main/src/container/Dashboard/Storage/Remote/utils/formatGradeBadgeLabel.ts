import type { Grade } from "@/components/application/device-check/types";

export function formatGradeBadgeLabel(grade: Grade, label?: string) {
  const text = label?.trim();
  return text ? `${grade} · ${text}` : grade;
}
