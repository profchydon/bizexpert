import type { StorageCartLine } from "./cartLineTypes";

export function filterStorageCartLinesForCompany(
  lines: StorageCartLine[],
  companyId: string | undefined,
): StorageCartLine[] {
  if (!companyId) return [];
  return lines.filter(
    (line) => line.company_id === companyId && Boolean(line.equipment_id),
  );
}
