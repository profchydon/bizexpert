import getSymbolFromCurrency from "currency-symbol-map";

export function formatCurrencyAmount(currency: string, value: number): string {
  const symbol = getSymbolFromCurrency(currency) ?? "";
  return `${symbol}${value.toLocaleString("en-US")}`;
}
