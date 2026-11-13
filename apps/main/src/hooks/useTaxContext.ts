import { useMemo } from "react";

import { useGetTaxDisplayQuery } from "@/api/baseQueries/companiesApi/settingsApi/taxDisplayApi/getTaxDisplay";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { CountryTaxConfig, ZERO_TAX } from "@/lib/tax/config";
import { ITaxContextPayload, TaxDisplayMode } from "@/types/tax";
import { useAuthUserDetail } from "@/utils/useAuthUser";

export type { TaxDisplayMode };

export interface TaxContext {
  config: CountryTaxConfig;
  mode: TaxDisplayMode;
  entityName: string;
  // True only while the jurisdiction is unknown, so price surfaces never flash a wrong label.
  isLoading: boolean;
}

function toConfig(payload: ITaxContextPayload | undefined): CountryTaxConfig {
  if (!payload) return ZERO_TAX;

  return {
    code: payload.country_code || ZERO_TAX.code,
    countryLabel: payload.country_label || ZERO_TAX.countryLabel,
    deviceLabel: payload.device_label || ZERO_TAX.deviceLabel,
    serviceLabel: payload.service_label || ZERO_TAX.serviceLabel,
    deviceRate: payload.device_rate || 0,
    serviceRate: payload.service_rate || 0,
  };
}

function toMode(mode: string | undefined): TaxDisplayMode {
  return mode === "at-payment" ? "at-payment" : "inclusive";
}

// Single source of truth for the jurisdiction rates/labels and the display mode every price
// surface annotates against. The settings endpoint is authoritative (it refreshes after a save
// through the TaxDisplay tag); the company payload captured at login is the fallback so surfaces
// render correct labels on first paint and while the request is in flight.
export function useTaxContext(): TaxContext {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();

  const { data, isLoading } = useGetTaxDisplayQuery(
    { companyId: companyId as string },
    { skip: !companyId },
  );

  const payload = data?.data ?? company?.tax_context;

  return useMemo(
    () => ({
      config: toConfig(payload),
      mode: toMode(payload?.display_mode ?? company?.tax_display_mode),
      entityName: company?.name || "Your Company",
      isLoading: isLoading && !payload,
    }),
    [payload, isLoading, company?.tax_display_mode, company?.name],
  );
}
