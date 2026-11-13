import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import { mapEntityBillingCurrency } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityBillingCurrency";
import { mapEntityCountryLabel } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityCountryLabel";
import type { ICompany } from "@/types/auth";

export type WorkspaceEquipmentDefaults = {
  countryName: string;
  currencyCode: string;
};

const EMPTY_DEFAULTS: WorkspaceEquipmentDefaults = {
  countryName: "",
  currencyCode: "",
};

const normalizeCode = (value: string | undefined | null) =>
  String(value ?? "")
    .trim()
    .toUpperCase();

export const resolveCompanyEquipmentDefaults = (
  company: ICompany | undefined | null,
): WorkspaceEquipmentDefaults => {
  if (!company) return EMPTY_DEFAULTS;
  return {
    countryName: String(company.country?.name ?? "").trim(),
    currencyCode: normalizeCode(
      company.billing_currency || company.billing_currency_code,
    ),
  };
};

export const resolveEntityEquipmentDefaults = (
  entity: EntityApiRecord | undefined | null,
): WorkspaceEquipmentDefaults => {
  if (!entity) return EMPTY_DEFAULTS;
  return {
    countryName: mapEntityCountryLabel(entity.country),
    currencyCode: normalizeCode(mapEntityBillingCurrency(entity)),
  };
};

export const resolveCurrencyIdForCode = (
  currencies: { id: string; code: string }[] | undefined,
  currencyCode: string,
) => {
  const code = normalizeCode(currencyCode);
  if (!code) return "";
  const match = (currencies ?? []).find(
    (currency) => normalizeCode(currency?.code) === code,
  );
  return match?.id ?? "";
};

export const buildWorkspaceCurrencyItems = (
  currencyId: string,
  currencyCode: string,
) =>
  currencyId && currencyCode ? [{ id: currencyId, label: currencyCode }] : [];

export const applyWorkspaceCountryDefault = (
  currentCountry: string | undefined,
  workspaceCountry: string | undefined,
) => {
  const current = String(currentCountry ?? "").trim();
  if (current) return current;
  return String(workspaceCountry ?? "").trim();
};

export const hasWorkspaceOverride = (
  savedValue: string | undefined,
  workspaceValue: string | undefined,
) => {
  const saved = String(savedValue ?? "").trim();
  const workspace = String(workspaceValue ?? "").trim();
  if (!saved || !workspace) return false;
  return saved !== workspace;
};

export const buildWorkspaceOverrideHint = (
  fieldLabel: string,
  savedValue: string | undefined,
) =>
  `Saved as ${savedValue}. Saving updates it to the workspace ${fieldLabel}.`;
