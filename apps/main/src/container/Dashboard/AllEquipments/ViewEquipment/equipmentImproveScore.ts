import type { IEquipment } from "@/types/equipments";
import { removeUserscore } from "@/utils/underScoreTransformer";

const IMPROVE_SCORE_ALLOWED_STATUSES = new Set(["assigned", "unassigned"]);

export function normalizeEquipmentStatus(status?: string | null) {
  return removeUserscore(status ?? "")
    .trim()
    .toLowerCase();
}

export function equipmentHasMissingInformation(
  equipment: Pick<
    IEquipment,
    "has_missing_information" | "missing_information" | "score"
  >,
) {
  if (equipment.has_missing_information === true) return true;
  if (
    Array.isArray(equipment.missing_information) &&
    equipment.missing_information.length > 0
  ) {
    return true;
  }
  if (typeof equipment.score === "number" && equipment.score < 100) {
    return true;
  }
  return false;
}

export function getImproveEquipmentScoreState(
  equipment: Pick<
    IEquipment,
    "has_missing_information" | "missing_information" | "score" | "status"
  >,
) {
  const status = normalizeEquipmentStatus(equipment.status);
  const hasMissing = equipmentHasMissingInformation(equipment);
  const statusAllowed = IMPROVE_SCORE_ALLOWED_STATUSES.has(status);

  if (!statusAllowed) {
    return {
      isDisabled: true,
      reason: `Cannot improve the score of an item ${status || "in this state"}.`,
    };
  }

  if (!hasMissing) {
    return {
      isDisabled: true,
      reason: "This item does not have missing information.",
    };
  }

  return { isDisabled: false, reason: null };
}
