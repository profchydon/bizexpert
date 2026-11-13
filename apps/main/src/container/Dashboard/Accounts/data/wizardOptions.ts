import { subsidiariesSeed } from "./subsidiariesSeed";

export const currencyOptions = [
  { value: "USD", label: "USD (US Dollar)" },
  { value: "GBP", label: "GBP (British Pound)" },
  { value: "EUR", label: "EUR (Euro)" },
];

const currencyName: Record<string, string> = {
  USD: "US Dollar",
  GBP: "British Pound",
  EUR: "Euro",
};

export const billingEntityOptions = subsidiariesSeed
  .filter(
    (subsidiary) =>
      subsidiary.billingMode === "self" && subsidiary.status === "operational",
  )
  .map((subsidiary) => ({
    value: subsidiary.id,
    label: subsidiary.name,
    description: `Bills in ${subsidiary.currency} (${currencyName[subsidiary.currency] ?? subsidiary.currency}). ${subsidiary.region}.`,
  }));

export function billingEntityById(id: string | null) {
  if (!id) return null;
  const entity = subsidiariesSeed.find((subsidiary) => subsidiary.id === id);
  return entity
    ? { name: entity.name, currency: entity.currency, region: entity.region }
    : null;
}
