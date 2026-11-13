export const STORE_BUSINESS_TYPE_OPTIONS = [
  { value: "retail", label: "Retail" },
  { value: "wholesale", label: "Wholesale" },
  { value: "restaurant", label: "Restaurant" },
  { value: "services", label: "Services" },
  { value: "other", label: "Other" },
] as const;

export type StoreBusinessType =
  (typeof STORE_BUSINESS_TYPE_OPTIONS)[number]["value"];

export function formatStoreBusinessType(value?: string | null): string {
  if (!value) return "—";
  return (
    STORE_BUSINESS_TYPE_OPTIONS.find((option) => option.value === value)
      ?.label ?? value
  );
}
