export const BILLING_CURRENCY_CODES = ["USD", "GBP", "EUR"];

export interface CurrencyOption {
  id: string;
  name: string;
  code: string;
}

export function filterBillingCurrencies(
  currencies: CurrencyOption[],
): CurrencyOption[] {
  return BILLING_CURRENCY_CODES.flatMap((code) => {
    const match = currencies.find(
      (currency) => currency.code?.toUpperCase() === code,
    );
    return match ? [match] : [];
  });
}
