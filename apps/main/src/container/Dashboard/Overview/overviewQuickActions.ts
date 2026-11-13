import type { StaticImageData } from "next/image";
import {
  catalog,
  equip_employee,
  offboard_device,
  storage_overview,
} from "@/assets/images";
import routes from "@/routes";
import type { OverviewQuickAction } from "./overviewQuickActionRules";

export type OverviewQuickActionConfig = OverviewQuickAction & {
  image: StaticImageData;
};

export const overviewQuickActions: OverviewQuickActionConfig[] = [
  {
    id: "action-equip",
    title: "Equip your employee",
    description: "Give employees top notch quality work tools.",
    cta: "Equip employee",
    image: equip_employee,
    href: routes.EMPLOYEES,
  },
  {
    id: "action-offboard",
    title: "Off-board of devices",
    description: "Gather all employee equipment and secure it.",
    cta: "Off-board device",
    image: offboard_device,
    href: routes.EMPLOYEES,
  },
  {
    id: "action-catalog",
    title: "Create micro-catalogs",
    description: "Create organized equipment lists for each department.",
    cta: "Create catalog",
    image: catalog,
    href: routes.CATALOG_POLICIES,
    featureGate: "Catalog",
  },
  {
    id: "action-storage",
    title: "Storage for equipment",
    description: "Manage equipment storage and logistics.",
    cta: "Store device",
    image: storage_overview,
    href: routes.STORAGE,
  },
];
