const SYMBOLS: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

export function currencySymbol(code: string | null | undefined): string {
  if (!code) return "";
  return SYMBOLS[code.toUpperCase()] ?? `${code} `;
}

export function formatPlanRate(amount: number, currency: string): string {
  const digits = Number.isInteger(amount) ? 0 : 2;
  return `${currencySymbol(currency)}${amount.toLocaleString("en-GB", {
    minimumFractionDigits: digits,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCharge(amount: number, currency: string): string {
  return `${currencySymbol(currency)}${amount.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
