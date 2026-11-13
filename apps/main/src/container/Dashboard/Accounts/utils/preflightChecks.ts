import type {
  ActingAdmin,
  CloseSubsidiaryBlockers,
  PreFlightCheck,
  Subsidiary,
} from "../types";
import type { ClosureBlockers } from "../data/accountsFixtures";
import { canManageEntity } from "./adminScope";

export function closureBlockersToFlags(
  blockers: ClosureBlockers,
): CloseSubsidiaryBlockers {
  return {
    hasActiveOffices: blockers === "offices" || blockers === "both",
    hasOutstandingReceivables: blockers === "ar" || blockers === "both",
  };
}

export function buildCloseSubsidiaryChecksFromFixture(
  subsidiary: Subsidiary | null,
  acting: ActingAdmin,
  closureBlockers: ClosureBlockers,
): PreFlightCheck[] {
  return buildCloseSubsidiaryChecks(
    subsidiary,
    acting,
    closureBlockersToFlags(closureBlockers),
  );
}

export function toConfirmSlug(name: string): string {
  return name.trim().replace(/\s+/g, "-");
}

export function confirmSlugMatches(
  typed: string,
  confirmSlug: string,
): boolean {
  return (
    confirmSlug.length > 0 &&
    typed.trim().toLowerCase() === confirmSlug.toLowerCase()
  );
}

export function buildCloseSubsidiaryChecks(
  subsidiary: Subsidiary | null,
  acting: ActingAdmin,
  blockers: CloseSubsidiaryBlockers,
): PreFlightCheck[] {
  const roleOk = subsidiary ? canManageEntity(subsidiary, acting) : false;
  const officesOk = !blockers.hasActiveOffices;
  const arOk = !blockers.hasOutstandingReceivables;

  return [
    {
      ok: roleOk,
      label: "Initiated by an authorized admin",
      blocked:
        "Only a Global admin or an admin of this entity can close it. Request closure via a support ticket.",
    },
    {
      ok: officesOk,
      label: "No active offices under this entity",
      blocked: "Active offices exist. Shut them down before closing.",
    },
    {
      ok: arOk,
      label: "No outstanding receivables (AR)",
      blocked:
        "Outstanding AR must be settled, written off, or reassigned to the parent before closing.",
    },
  ];
}

export function canCloseSubsidiary(checks: PreFlightCheck[]): boolean {
  return checks.every((check) => check.ok);
}

export function buildCloseOfficeChecks(
  employeesCount: number,
  assetsCount: number,
): PreFlightCheck[] {
  const employeesOk = employeesCount === 0;
  const assetsOk = assetsCount === 0;

  return [
    {
      ok: employeesOk,
      label: "Every employee removed",
      blocked: `${employeesCount} employee${employeesCount === 1 ? "" : "s"} still assigned. Off-board or reassign them first.`,
    },
    {
      ok: assetsOk,
      label: "Every asset removed",
      blocked: `${assetsCount} asset${assetsCount === 1 ? "" : "s"} still here. Off-board or reassign them first.`,
    },
  ];
}

export function canCloseOffice(checks: PreFlightCheck[]): boolean {
  return checks.every((check) => check.ok);
}
