export const officesTableColumns = [
  {
    id: "name" as const,
    label: "Office",
    tooltip: "The office name.",
  },
  {
    id: "subsidiary" as const,
    label: "Entity",
    tooltip: "The entity this office operates under.",
  },
  {
    id: "region" as const,
    label: "Country",
    tooltip: "Country the office is located in.",
  },
  {
    id: "type" as const,
    label: "Type",
    tooltip: "Physical location or remote workforce.",
  },
];
