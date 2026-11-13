import {
  isOfficeAdministratorMembership,
  type AccessContext,
  type ActingAccessRole,
} from "@/utils/auth/resolveAccessContext";

export type OverviewTier = "global" | "entity" | "office";

export function resolveOverviewTier({
  isGlobalAdmin,
  activeEntityId,
  actingRole,
  officeAdminOfficeIds,
}: {
  isGlobalAdmin: boolean;
  activeEntityId: string | null;
  actingRole: ActingAccessRole;
  officeAdminOfficeIds: string[];
}): OverviewTier {
  if (
    !isGlobalAdmin &&
    actingRole === "office" &&
    officeAdminOfficeIds.length > 0
  ) {
    return "office";
  }

  if (activeEntityId) {
    return "entity";
  }

  return "global";
}

export function pickOfficeOverviewTarget(access: AccessContext) {
  const membership = access.memberships.find(isOfficeAdministratorMembership);

  return {
    companyId: membership?.id ?? null,
    officeId:
      membership?.office_ids?.[0] ?? access.officeAdminOfficeIds[0] ?? null,
  };
}

export function entityOverviewSubtitle(region: string, currency: string) {
  const country = region.trim();
  const billed = currency.trim();
  const countryPart = country
    ? `Country view for ${country}.`
    : "Country view.";
  return billed ? `${countryPart} Billed in ${billed}.` : countryPart;
}

export function officeOverviewSubtitle(parentName: string, region: string) {
  const parent = parentName.trim();
  const place = region.trim();
  if (parent && place) {
    return `Office view. Part of ${parent}, ${place}.`;
  }
  if (parent) {
    return `Office view. Part of ${parent}.`;
  }
  if (place) {
    return `Office view. ${place}.`;
  }
  return "Office view.";
}
