import type { BadgeColor } from "@/components/base/badges/badges";

type PillColor = BadgeColor<"pill-color">;

export type TransactionTypeMeta = {
  label: string;
  color: PillColor;
};

const TYPE_META: Record<string, TransactionTypeMeta> = {
  onboarding: { label: "Onboarding", color: "success" },
  offboarding: { label: "Offboarding", color: "warning" },
  buy_to_storage: { label: "Buy to Storage", color: "purple" },
  storage: { label: "Storage", color: "blue-light" },
  storage_order: { label: "Storage", color: "blue-light" },
  storage_to_employee: { label: "Storage To Employee", color: "blue" },
  renew_storage: { label: "Renew Storage", color: "warning" },
  device_refresh: { label: "Device refresh", color: "blue" },
  deployment: { label: "Deployment", color: "blue" },
};

export const normalizeTransactionType = (value?: string) =>
  (value ?? "").trim().toLowerCase().replaceAll("-", "_").replace(/\s+/g, "_");

const formatUnknownTypeLabel = (value: string) => {
  const normalized = value.replaceAll("_", " ").replaceAll("-", " ").trim();
  if (!normalized) {
    return "";
  }

  return normalized
    .split(/\s+/)
    .map(
      (word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join(" ");
};

export const getTransactionTypeMeta = (
  type?: string,
): TransactionTypeMeta | null => {
  const raw = type?.trim();
  if (!raw) {
    return null;
  }

  const key = normalizeTransactionType(raw);
  if (TYPE_META[key]) {
    return TYPE_META[key];
  }

  const label = formatUnknownTypeLabel(raw);
  if (!label) {
    return null;
  }

  return { label, color: "gray" };
};

export const collectTransactionTypes = (values: Array<string | undefined>) => {
  const seen = new Set<string>();
  const types: string[] = [];

  for (const value of values) {
    const key = normalizeTransactionType(value);
    if (!key || key === "service_fee" || seen.has(key)) {
      continue;
    }
    seen.add(key);
    types.push(value!.trim());
  }

  return types;
};

export const resolveTransactionTypeValues = (transaction: {
  multiple_order_details?: Array<{ type?: string }>;
  items_details?: Array<{ type?: string }>;
}) => {
  const orderTypes = collectTransactionTypes(
    (transaction.multiple_order_details ?? []).map((detail) => detail.type),
  );
  if (orderTypes.length > 0) {
    return orderTypes;
  }

  return collectTransactionTypes(
    (transaction.items_details ?? []).map((item) => item.type),
  );
};
