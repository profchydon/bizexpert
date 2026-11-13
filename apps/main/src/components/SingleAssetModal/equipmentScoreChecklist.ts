import { normalizeEquipmentStatus } from "@/container/Dashboard/AllEquipments/ViewEquipment/equipmentImproveScore";
import { EquipmentConstant } from "@/types/equipments";

export type EquipmentScoreChecklistAction =
  | "edit"
  | "assign"
  | "createCatalog"
  | "refresh";

export type EquipmentScoreChecklistItem = {
  key: string;
  label: string;
  weight: number;
  buttonLabel: string;
  action: EquipmentScoreChecklistAction;
  isDisabled?: boolean;
  disabledReason?: string | null;
};

type ChecklistFieldConfig = Omit<
  EquipmentScoreChecklistItem,
  "key" | "isDisabled" | "disabledReason"
>;

const CHECKLIST_FIELDS: Partial<
  Record<EquipmentConstant, ChecklistFieldConfig>
> = {
  [EquipmentConstant.assignee]: {
    label: "Assign it to an employee",
    weight: 40,
    buttonLabel: "Assign",
    action: "assign",
  },
  [EquipmentConstant.country]: {
    label: "Add a location",
    weight: 10,
    buttonLabel: "Add",
    action: "edit",
  },
  [EquipmentConstant.purchase_date]: {
    label: "Add the purchase date",
    weight: 10,
    buttonLabel: "Add",
    action: "edit",
  },
  [EquipmentConstant.purchase_price]: {
    label: "Add the purchase price",
    weight: 10,
    buttonLabel: "Add",
    action: "edit",
  },
  [EquipmentConstant.type]: {
    label: "Add a device configuration",
    weight: 10,
    buttonLabel: "Add",
    action: "edit",
  },
  [EquipmentConstant.model]: {
    label: "Add model",
    weight: 10,
    buttonLabel: "Add",
    action: "edit",
  },
  [EquipmentConstant.make]: {
    label: "Add make",
    weight: 10,
    buttonLabel: "Add",
    action: "edit",
  },
  [EquipmentConstant.serial_number]: {
    label: "Add a serial number",
    weight: 10,
    buttonLabel: "Add",
    action: "edit",
  },
  [EquipmentConstant.image_url]: {
    label: "Add a device image",
    weight: 10,
    buttonLabel: "Add",
    action: "edit",
  },
  [EquipmentConstant.state]: {
    label: "Add state",
    weight: 10,
    buttonLabel: "Add",
    action: "edit",
  },
  [EquipmentConstant.refresh_status]: {
    label: "Refresh equipment",
    weight: 10,
    buttonLabel: "Fix",
    action: "refresh",
  },
};

const enumValues = new Set<string>(Object.values(EquipmentConstant));

function parseMissingField(field: string): EquipmentConstant | null {
  const normalized = field.trim().toLowerCase();
  if (!enumValues.has(normalized)) return null;
  return normalized as EquipmentConstant;
}

export function buildEquipmentScoreChecklist(
  missingInformation: string[] | undefined | null,
  equipmentStatus?: string | null,
): EquipmentScoreChecklistItem[] {
  const safeMissing = Array.isArray(missingInformation)
    ? missingInformation
    : [];
  const isAssigned = normalizeEquipmentStatus(equipmentStatus) === "assigned";

  return safeMissing.flatMap((field): EquipmentScoreChecklistItem[] => {
    const parsed = parseMissingField(field);
    if (!parsed) return [];

    const config = CHECKLIST_FIELDS[parsed];
    if (!config) return [];

    if (parsed === EquipmentConstant.refresh_status) {
      return [
        {
          key: parsed,
          ...config,
          isDisabled: !isAssigned,
          disabledReason: isAssigned
            ? null
            : "Assign the equipment before refreshing it.",
        },
      ];
    }

    return [
      {
        key: parsed,
        ...config,
      },
    ];
  });
}
