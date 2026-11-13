import { getCheckPhotos } from "@/components/application/device-check/checkPhotos";
import { getDeviceCheckSchema } from "@/components/application/device-check/checkSchema";
import type {
  ConditionRating,
  DeviceCheckReport,
  Grade,
  StoredDevice,
} from "../types/storage";
import type { DeviceCheckDetailState } from "../types/equipmentDetail";

export type DeviceCheckState = DeviceCheckDetailState;

const NOTES_BY_GRADE: Record<Grade, string> = {
  A: "Like-new. All ports and functions tested, no cosmetic defects.",
  B: "Minor wear consistent with light use. Fully functional.",
  C: "Visible cosmetic wear. Functional; consider before senior-hire deployment.",
  D: "Heavy wear / functional concerns. Best suited to disposal or buyback.",
};

const RATING_ORDER: ConditionRating[] = ["Poor", "Fair", "Good", "Excellent"];
const BASE_RATING_INDEX: Record<Grade, number> = { A: 3, B: 2, C: 1, D: 0 };

/** Deterministic small integer derived from the device id (stable across renders). */
function hash(id: string): number {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return sum;
}

export function buildDeviceCheck(device: StoredDevice): DeviceCheckState {
  if (device.entrySource === "buy_to_storage") return { kind: "new" };
  if (!device.grade || !device.lastCheckDate) return { kind: "awaiting" };

  const grade = device.grade;
  const schema = getDeviceCheckSchema(device.assetType);
  const h = hash(device.id);
  const base = BASE_RATING_INDEX[grade];
  const nudgeField = h % schema.conditions.length; // one field reads a notch better

  const condition = schema.conditions.map((field, i) => ({
    label: field.label,
    rating: RATING_ORDER[Math.min(base + (i === nudgeField ? 1 : 0), 3)],
  }));

  const missing = grade === "C" ? 1 : grade === "D" ? 2 : 0; // lower grades miss accessories
  const accessories = schema.accessories.map((name, i) => ({
    name,
    present: i < schema.accessories.length - missing,
  }));

  const photoCount = Math.min(
    schema.minPhotos + (grade === "C" || grade === "D" ? 1 : 0),
    getCheckPhotos(device.assetType).length,
  );

  return {
    kind: "report",
    // A pending_check device that already carries a grade is awaiting a *re-check*:
    // we show the previous results and flag that they'll be refreshed.
    pendingRecheck: device.status === "pending_check",
    report: {
      grade,
      condition,
      powersOn: schema.showPowersOn ? true : null,
      accessories,
      serialVerified: schema.requireSerial,
      notes: NOTES_BY_GRADE[grade],
      photos: getCheckPhotos(device.assetType).slice(0, photoCount),
      checkedAt: device.lastCheckDate,
    },
  };
}
