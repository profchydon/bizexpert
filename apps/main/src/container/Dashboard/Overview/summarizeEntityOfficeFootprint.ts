import type { IDashboardCountrySummary } from "@/types/dashboard";
import type { ServerOffice } from "@/types/offices";
import { officeStatusFromServer } from "@/container/Dashboard/Accounts/Offices/utils/mapServerOffice";

export function summarizeEntityOfficeFootprint(offices: ServerOffice[]) {
  const live = offices.filter(
    (office) => officeStatusFromServer(office.status) !== "closed",
  );
  const areaCounts = new Map<string, number>();

  for (const office of live) {
    for (const area of office.areas ?? []) {
      const name = area.name?.trim();
      if (!name) continue;
      areaCounts.set(
        name,
        (areaCounts.get(name) ?? 0) + (area.asset_count ?? 0),
      );
    }
  }

  return {
    total: live.length,
    physical: live.filter((office) => office.type === "physical").length,
    remote: live.filter((office) => office.type === "remote").length,
    areas: [...areaCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort(
        (left, right) =>
          right.count - left.count || left.name.localeCompare(right.name),
      ),
  };
}

export function pickCountryStorageCount(
  rows: IDashboardCountrySummary[],
  region: string,
  countryCode?: string,
) {
  const label = region.trim().toLowerCase();
  const code = countryCode?.trim().toLowerCase();
  const row = rows.find((entry) => {
    if (label && entry.country?.trim().toLowerCase() === label) return true;
    if (code && entry.country_code?.trim().toLowerCase() === code) return true;
    return false;
  });

  return row?.equipment_in_storage_count ?? 0;
}
