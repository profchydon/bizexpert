import routes from "@/routes";

import type { CatalogRuleApprover } from "./types";

export function formatCatalogApproverLabel(approver: CatalogRuleApprover) {
  const name = [approver.firstName, approver.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (name && approver.email) return `${name} · ${approver.email}`;
  return name || approver.email || "-";
}

export function getCatalogApproverHref(approverId: string) {
  return `${routes.EMPLOYEES}/${approverId}`;
}
