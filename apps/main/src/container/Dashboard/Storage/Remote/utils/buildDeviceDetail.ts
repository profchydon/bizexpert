import { GRADE_LABELS, SOURCE_LABEL, STATUS_LABEL } from "../data/storageMeta";
import type { StoredDevice, TimelineEvent } from "../types/storage";

/** Build a chronological lifecycle timeline from the device's known fields. */
export function buildTimeline(device: StoredDevice): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: `${device.id}-entered`,
      label: "Entered storage",
      detail: `${SOURCE_LABEL[device.entrySource]} · ${device.warehouse}, ${device.country}`,
      at: device.entryDate,
    },
  ];
  if (device.grade && device.lastCheckDate) {
    events.push({
      id: `${device.id}-check`,
      label: "Device check completed",
      detail: `Grade ${device.grade} — ${GRADE_LABELS[device.grade]}`,
      at: device.lastCheckDate,
    });
  }
  events.push({
    id: `${device.id}-status`,
    label: `Current status: ${STATUS_LABEL[device.status]}`,
    at: device.lastCheckDate ?? device.entryDate,
  });
  return events.sort(
    (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime(),
  );
}
