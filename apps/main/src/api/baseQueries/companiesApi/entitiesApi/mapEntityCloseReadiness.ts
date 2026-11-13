import type { PreFlightCheck } from "@/container/Dashboard/Accounts/types";
import type { EntityCloseReadinessCheck } from "./entityDetailTypes";

const closeCheckBlockedCopy: Record<string, string> = {
  authorized_admin:
    "Only a Global admin or an admin of this entity can close it. Request closure via a support ticket.",
  no_active_offices: "Active offices exist. Shut them down before closing.",
  no_outstanding_ar:
    "Outstanding AR must be settled, written off, or reassigned to the parent before closing.",
};

export function mapEntityCloseReadinessChecks(
  checks: EntityCloseReadinessCheck[] | undefined,
): PreFlightCheck[] {
  if (!checks?.length) return [];

  return checks.map((check) => ({
    ok: check.passed,
    label: check.message,
    blocked: check.passed
      ? undefined
      : (closeCheckBlockedCopy[check.code] ?? check.message),
  }));
}
