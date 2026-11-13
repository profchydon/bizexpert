export function canShowOrderingForBanner(
  isGlobalAdmin: boolean,
  administeredEntityCount: number,
) {
  return isGlobalAdmin || administeredEntityCount > 1;
}

export function resolveOrderingForTarget({
  officeName,
  officeCountryCode,
  officeCurrency,
  isGlobalWorkspace,
  companyName,
  companyCurrency,
  companyCountryCode,
  entityName,
  entityCurrency,
  entityCountryCode,
}: {
  officeName?: string | null;
  officeCountryCode?: string | null;
  officeCurrency?: string | null;
  isGlobalWorkspace: boolean;
  companyName?: string | null;
  companyCurrency?: string | null;
  companyCountryCode?: string | null;
  entityName?: string | null;
  entityCurrency?: string | null;
  entityCountryCode?: string | null;
}) {
  if (officeName?.trim()) {
    return {
      name: officeName.trim(),
      currency: (entityCurrency ?? officeCurrency ?? companyCurrency ?? "")
        .trim()
        .toUpperCase(),
      countryCode: officeCountryCode?.trim().toUpperCase() || undefined,
    };
  }

  if (isGlobalWorkspace) {
    return {
      name: companyName?.trim() || "",
      currency: (companyCurrency ?? "").trim().toUpperCase(),
      countryCode: companyCountryCode?.trim().toUpperCase() || undefined,
    };
  }

  return {
    name: entityName?.trim() || companyName?.trim() || "",
    currency: (entityCurrency ?? companyCurrency ?? "").trim().toUpperCase(),
    countryCode:
      entityCountryCode?.trim().toUpperCase() ||
      companyCountryCode?.trim().toUpperCase() ||
      undefined,
  };
}
