import type {
  DeviceCheckReport,
  Grade,
  StoredDevice,
  TimelineEvent,
} from "./storage";

export type DeviceCheckDetailState =
  | {
      kind: "new";
      grade?: Grade;
      label?: string;
      subtitle?: string;
      note?: string;
    }
  | { kind: "awaiting"; subtitle?: string; note?: string }
  | { kind: "report"; report: DeviceCheckReport; pendingRecheck: boolean };

export interface StorageEquipmentDetailView {
  device: StoredDevice;
  lifecycle: TimelineEvent[];
  specifications: { label: string; value: string }[];
  deviceCheck: DeviceCheckDetailState;
}
