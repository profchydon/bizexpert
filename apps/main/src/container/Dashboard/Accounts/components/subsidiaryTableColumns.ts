import type { SubsidiarySortKey } from "../types";

export const subsidiaryTableColumns: {
  id: SubsidiarySortKey;
  label: string;
  tooltip: string;
}[] = [
  {
    id: "name",
    label: "Entity",
    tooltip: "The entity's registered name. Each one bills independently.",
  },
  {
    id: "region",
    label: "Country",
    tooltip: "Country the entity is registered in.",
  },
  {
    id: "currency",
    label: "Currency",
    tooltip: "Locked billing currency for this entity.",
  },
  {
    id: "offices",
    label: "Offices",
    tooltip: "Number of offices operating under this entity.",
  },
  {
    id: "status",
    label: "Status",
    tooltip: "Current billing state of the entity.",
  },
];
