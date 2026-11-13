import type { CountryTaxConfig } from "./config";

export interface TaxLine {
  label: string;
  rate: number;
  amount: number;
}

export interface TaxBreakdown {
  deviceSubtotal: number;
  serviceSubtotal: number;
  deviceTax: TaxLine;
  serviceTax: TaxLine;
  taxTotal: number;
  totalWithTax: number;
}

// Round to 2 decimals for money display.
export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

// Build the full tax breakdown for a device subtotal and a service subtotal. Each tax line is
// rounded on its own (line-level rounding) before the lines are summed, so the total matches what
// a reader adds up from the printed rows.
export function computeTaxBreakdown(
  deviceBase: number,
  serviceBase: number,
  config: CountryTaxConfig,
): TaxBreakdown {
  const deviceTax: TaxLine = {
    label: config.deviceLabel,
    rate: config.deviceRate,
    amount: roundMoney(deviceBase * config.deviceRate),
  };
  const serviceTax: TaxLine = {
    label: config.serviceLabel,
    rate: config.serviceRate,
    amount: roundMoney(serviceBase * config.serviceRate),
  };
  const taxTotal = deviceTax.amount + serviceTax.amount;
  return {
    deviceSubtotal: deviceBase,
    serviceSubtotal: serviceBase,
    deviceTax,
    serviceTax,
    taxTotal,
    totalWithTax: roundMoney(deviceBase + serviceBase + taxTotal),
  };
}

// Add tax onto a net amount (used for tax-inclusive display pricing).
export function grossUp(net: number, rate: number): number {
  return roundMoney(net * (1 + rate));
}

// Format a fraction as a percent string with up to 3 decimals and no trailing zeros, so 0.075 reads
// "7.5%" and 0.08875 reads "8.875%".
export function ratePercent(rate: number): string {
  return parseFloat((rate * 100).toFixed(3)).toString() + "%";
}
