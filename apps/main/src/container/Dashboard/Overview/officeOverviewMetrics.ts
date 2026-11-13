import type { OfficeSnapshot } from "@/types/offices";
import { formatOfficeMoney } from "@/container/Dashboard/Accounts/Offices/detail/utils/officeFormat";

export function officeOverviewMetrics({
  snapshot,
  activeOrders,
  currency,
}: {
  snapshot: OfficeSnapshot | undefined;
  activeOrders: number;
  currency: string;
}) {
  return [
    { label: "Employees", value: String(snapshot?.employees ?? 0) },
    { label: "Assets", value: String(snapshot?.assets ?? 0) },
    { label: "Active orders", value: String(activeOrders) },
    {
      label: "Asset value",
      value: formatOfficeMoney(snapshot?.asset_value ?? 0, currency),
    },
  ];
}
