export type TaxDisplayMode = "inclusive" | "at-payment";

// Shape of the backend tax context (`GET/POST /companies/:id/settings/tax-display`, and the
// `tax_context` block on the company payload). Rates are fractions: 0.2 means 20%.
export interface ITaxContextPayload {
  country_code: string | null;
  country_label: string | null;
  device_rate: number;
  service_rate: number;
  device_label: string | null;
  service_label: string | null;
  display_mode: TaxDisplayMode;
}

export interface ISetTaxDisplayMode {
  companyId: string;
  payload: { tax_display_mode: TaxDisplayMode };
}
