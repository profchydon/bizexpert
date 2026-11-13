// Per-country sales tax configuration shared across products (Rayda Remote billing, Rayda Admin
// orders, invoices). Two percentage taxes apply after markup: a device tax on the marked-up device
// subtotal and a service tax on Rayda fees.
export interface CountryTaxConfig {
  code: string; // lowercase ISO alpha-2 ("gb")
  countryLabel: string; // "United Kingdom"
  deviceLabel: string; // "VAT" | "GST" | "Sales Tax"
  serviceLabel: string;
  deviceRate: number; // fraction: 0.2 means 20%
  serviceRate: number;
}

// Fallback for any code we do not have a rate for: no tax, neutral labels.
export const ZERO_TAX: CountryTaxConfig = {
  code: "zz",
  countryLabel: "Other",
  deviceLabel: "Tax",
  serviceLabel: "Tax",
  deviceRate: 0,
  serviceRate: 0,
};
