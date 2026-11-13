import type { ApprovalFilterTab } from "./types";

export function getApprovalListQuerySkips({
  activeTab,
  companyId,
}: {
  activeTab: ApprovalFilterTab;
  companyId?: string;
}) {
  const skipForMissingCompany = !companyId;

  return {
    skipAll: skipForMissingCompany || activeTab === "awaiting",
    skipPending: skipForMissingCompany || activeTab !== "awaiting",
  };
}
