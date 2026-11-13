import type { Grade } from "@/components/application/device-check/types";
import type { IInStorageEquipmentDetailCheck } from "@/types/equipmentsInStorageInventory";
import type { DeviceCheckDetailState } from "../types/equipmentDetail";
import type { ConditionRating, StoredDevice } from "../types/storage";
import { mapDeviceCheckPhotos } from "./mapDeviceCheckPhotos";

const VALID_GRADES: Grade[] = ["A", "B", "C", "D"];
const VALID_RATINGS: ConditionRating[] = ["Excellent", "Good", "Fair", "Poor"];
const PENDING_CHECK_STATUSES = new Set(["awaiting", "pending"]);

function mapGrade(value: string | null | undefined): Grade | undefined {
  return VALID_GRADES.includes(value as Grade) ? (value as Grade) : undefined;
}

function mapRating(value: string | undefined): ConditionRating | null {
  return VALID_RATINGS.includes(value as ConditionRating)
    ? (value as ConditionRating)
    : null;
}

function hasPriorReport(
  check: IInStorageEquipmentDetailCheck,
  device: StoredDevice,
): boolean {
  return Boolean(
    mapGrade(check.overall_grade) ||
    device.grade ||
    check.condition_by_component.length > 0 ||
    check.photos.length > 0 ||
    check.checked_at ||
    device.lastCheckDate,
  );
}

function isPendingCheckStatus(status: string): boolean {
  return PENDING_CHECK_STATUSES.has(status);
}

export function mapDeviceCheckDetail(
  check: IInStorageEquipmentDetailCheck,
  device: StoredDevice,
): DeviceCheckDetailState {
  if (check.status === "not_required") {
    return {
      kind: "new",
      grade: mapGrade(check.overall_grade),
      label: check.grade_label ?? undefined,
      subtitle: check.subtitle ?? undefined,
      note: check.note ?? undefined,
    };
  }

  if (isPendingCheckStatus(check.status) && !hasPriorReport(check, device)) {
    return {
      kind: "awaiting",
      subtitle: check.subtitle ?? undefined,
      note: check.note ?? undefined,
    };
  }

  const grade = mapGrade(check.overall_grade) ?? device.grade ?? "B";

  return {
    kind: "report",
    pendingRecheck:
      device.status === "pending_check" || isPendingCheckStatus(check.status),
    report: {
      grade,
      condition: check.condition_by_component.flatMap((item) => {
        const rating = mapRating(item.rating ?? item.condition);
        if (!rating) return [];
        return [
          {
            label: item.label ?? item.component ?? "Component",
            rating,
          },
        ];
      }),
      powersOn: check.summary?.powers_on ?? null,
      accessories: check.accessories_included.map((item) => ({
        name: item.name,
        present: item.present ?? true,
      })),
      serialVerified: check.summary?.serial_verified ?? false,
      notes: check.note ?? "",
      photos: mapDeviceCheckPhotos(check.photos),
      checkedAt: check.checked_at ?? device.lastCheckDate ?? device.entryDate,
    },
  };
}
