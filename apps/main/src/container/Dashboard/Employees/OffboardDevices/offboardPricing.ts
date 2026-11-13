import type { IEquipment } from "@/types/equipments";
import type { DeviceLine, Disposition, WipeType } from "@/types/offboard";

export type {
  DeviceLine,
  Disposition,
  ReassignTarget,
  WipeType,
} from "@/types/offboard";

export type DispositionOption = {
  value: Disposition;
  label: string;
  disabled?: boolean;
};

export const DISPOSITION_OPTIONS: DispositionOption[] = [
  { value: "STORE", label: "Store" },
  { value: "DISPOSE", label: "Dispose", disabled: true },
  { value: "REASSIGN", label: "Reassign", disabled: true },
];

export const WIPE_OPTIONS: { value: WipeType; label: string }[] = [
  { value: "Full Factory Reset", label: "Full Factory Reset" },
  { value: "Destruction Certificate", label: "Destruction Certificate" },
  { value: "None", label: "None" },
];

export const WIPE_OPTIONS_BY_DISPOSITION: Record<Disposition, WipeType[]> = {
  STORE: ["None", "Full Factory Reset"],
  DISPOSE: ["Destruction Certificate"],
  REASSIGN: ["None", "Full Factory Reset"],
};

export const getWipeOptions = (
  disposition: Disposition,
): { value: WipeType; label: string }[] =>
  WIPE_OPTIONS.filter((option) =>
    WIPE_OPTIONS_BY_DISPOSITION[disposition].includes(option.value),
  );

export const isWipeAllowed = (
  disposition: Disposition,
  wipeType: WipeType,
): boolean => WIPE_OPTIONS_BY_DISPOSITION[disposition].includes(wipeType);

export const getBulkWipeOptions = (
  dispositions: Disposition[],
): { value: WipeType; label: string }[] => {
  const distinct = Array.from(new Set(dispositions));
  if (distinct.length === 0) return [];
  return WIPE_OPTIONS.filter((option) =>
    distinct.every((disposition) => isWipeAllowed(disposition, option.value)),
  );
};

export const resolveUniformValue = <T>(values: T[]): T | null => {
  const distinct = Array.from(new Set(values));
  return distinct.length === 1 ? distinct[0] : null;
};

export const defaultWipeFor = (disposition: Disposition): WipeType =>
  WIPE_OPTIONS_BY_DISPOSITION[disposition][0];

export const applyDispositionToLine = (
  line: DeviceLine,
  disposition: Disposition,
): DeviceLine => ({
  ...line,
  disposition,
  wipeType: isWipeAllowed(disposition, line.wipeType)
    ? line.wipeType
    : defaultWipeFor(disposition),
  ...(disposition === "REASSIGN" ? {} : { reassignTarget: undefined }),
});

export const applyWipeToLine = (
  line: DeviceLine,
  wipeType: WipeType,
): DeviceLine =>
  isWipeAllowed(line.disposition, wipeType) ? { ...line, wipeType } : line;

export const DEFAULT_DISPOSITION: Disposition = "STORE";
export const DEFAULT_WIPE_TYPE: WipeType = defaultWipeFor(DEFAULT_DISPOSITION);

export const ASSIGNED_STATUS = "assigned";

export const isAssignedDevice = (item: Pick<IEquipment, "status">): boolean =>
  item.status?.toLowerCase() === ASSIGNED_STATUS;

export const buildDeviceLines = (
  equipment: IEquipment[] | undefined | null,
): DeviceLine[] => {
  if (!Array.isArray(equipment)) return [];

  return equipment.filter(isAssignedDevice).map((item, index) => ({
    id: `${item.id ?? "device"}-${index}`,
    equipmentId: item.id ?? "",
    name: item.title || "Device",
    serial: item.serial_number || "—",
    imageUrl: item.image_url || null,
    disposition: DEFAULT_DISPOSITION,
    wipeType: DEFAULT_WIPE_TYPE,
    fee: 0,
    assetType: item.type || undefined,
  }));
};

export const mergeDeviceLinesWithReview = (
  built: DeviceLine[],
  reviewDevices: DeviceLine[] | undefined | null,
): { lines: DeviceLine[]; selection: string[] } => {
  const reviewed = reviewDevices?.length ? reviewDevices : null;
  if (!reviewed) {
    return { lines: built, selection: built.map((line) => line.id) };
  }

  const reviewById = new Map(reviewed.map((line) => [line.id, line]));
  const lines = built.map((line) => {
    const match = reviewById.get(line.id);
    return match
      ? {
          ...line,
          disposition: match.disposition,
          wipeType: match.wipeType,
          reassignTarget: match.reassignTarget,
        }
      : line;
  });

  const builtIds = new Set(built.map((line) => line.id));
  const selection = reviewed
    .map((line) => line.id)
    .filter((id) => builtIds.has(id));

  return { lines, selection };
};

export const isReassignIncomplete = (line: DeviceLine): boolean =>
  line.disposition === "REASSIGN" && !line.reassignTarget;

export const hasMissingReassignTarget = (
  linesByEmployee: Record<string, DeviceLine[]>,
): boolean =>
  Object.values(linesByEmployee).some((lines) =>
    lines.some(isReassignIncomplete),
  );

export const calculateServiceFeesTotal = (lines: DeviceLine[]): number =>
  lines.reduce((total, line) => total + (line.fee || 0), 0);

export const formatServiceFee = (amount: number): string =>
  `$${amount.toLocaleString("en-US")}`;

export {
  buildServiceFeeTable,
  feeForDevice,
  sumServiceFees,
  type ServiceFeeTable,
} from "./offboardServiceFees";
