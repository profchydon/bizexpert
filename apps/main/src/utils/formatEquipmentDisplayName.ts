export const formatEquipmentDisplayName = (title?: string | null): string =>
  title?.replaceAll("-", " ").trim() ?? "";
