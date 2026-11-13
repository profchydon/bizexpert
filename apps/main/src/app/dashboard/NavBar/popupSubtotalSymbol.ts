import { cartCurrency } from "@/container/Dashboard/Storage/Remote/utils/storagePricing";
import { currencySymbol } from "@/utils/currencySymbol";
import getCurrencySymbolFromCode from "./getCurrencySymbolFromCode";

export function popupSubtotalSymbol(input: {
  productCurrency?: string | null;
  actionCurrencies: Array<string | null | undefined>;
  billingSymbol: string;
}): string {
  if (input.productCurrency?.trim()) {
    return getCurrencySymbolFromCode(input.productCurrency);
  }

  const hasActionCurrency = input.actionCurrencies.some((currency) =>
    currencySymbol(currency),
  );
  if (hasActionCurrency) {
    return cartCurrency(
      input.actionCurrencies.map((currency) => ({ currency })),
    );
  }

  return input.billingSymbol || cartCurrency([]);
}
