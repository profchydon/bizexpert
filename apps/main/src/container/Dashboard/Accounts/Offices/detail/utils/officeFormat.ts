import { formatCurrencyAmount } from "../../../utils/formatCurrencyAmount";

export function formatOfficeMoney(value: number, currency: string): string {
  return formatCurrencyAmount(currency, Math.round(value));
}
