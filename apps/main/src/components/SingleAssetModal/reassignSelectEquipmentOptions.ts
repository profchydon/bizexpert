import type { ComponentType, SVGProps } from "react";
import { LayersThree01, SwitchHorizontal01 } from "@untitledui/icons";

export type ReassignEquipmentOption = {
  id: string;
  label: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  enabled: boolean;
};

export const REASSIGN_EQUIPMENT_OPTIONS: ReassignEquipmentOption[] = [
  {
    id: "System reassignment",
    label: "System reassignment",
    description:
      "Just changing the employee assigned to the equipment in the system.",
    icon: SwitchHorizontal01,
    enabled: true,
  },
  {
    id: "Off-boarding equipment",
    label: "Off-boarding equipment",
    description: "Collect and deliver the equipment to the new employee.",
    icon: LayersThree01,
    enabled: true,
  },
];
