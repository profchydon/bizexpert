import type { Grade } from "@/components/application/device-check/types";
import type { IInStorageInventoryGrade } from "@/types/equipmentsInStorageInventory";

const VALID_GRADES: Grade[] = ["A", "B", "C", "D"];

function mapGrade(value: string | undefined): Grade | undefined {
  return VALID_GRADES.includes(value as Grade) ? (value as Grade) : undefined;
}

export function resolveInventoryGrade(grade: IInStorageInventoryGrade) {
  return {
    grade: mapGrade(grade.grade),
    gradeLabel: grade.label?.trim() || undefined,
    lastCheckDate: grade.checked_at ?? undefined,
    checkedDaysAgo: grade.checked_days_ago ?? undefined,
    gradeSynthetic: grade.synthetic,
  };
}
