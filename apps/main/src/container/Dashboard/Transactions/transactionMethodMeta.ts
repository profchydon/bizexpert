export type TransactionFilter = "all" | "card" | "credit";
export type TransactionView = "card" | "table";
export type TransactionFilterApiType = "Credit" | "Cash" | null;

export type TransactionFilterTab = {
  key: TransactionFilter;
  label: string;
};

export const transactionFilterTabs: TransactionFilterTab[] = [
  { key: "all", label: "All" },
  { key: "card", label: "Card" },
  { key: "credit", label: "Credit" },
];

export const transactionFilterToApiType = (
  filter: TransactionFilter,
): TransactionFilterApiType => {
  if (filter === "credit") {
    return "Credit";
  }
  if (filter === "card") {
    return "Cash";
  }
  return null;
};

export const formatTransactionMethod = (method?: string | null) => {
  const key = method?.trim().toLowerCase() ?? "";
  if (key === "cash" || key === "card") {
    return "Card";
  }
  if (key === "credit" || key === "wallet") {
    return "Credit";
  }
  if (!method?.trim()) {
    return "-";
  }
  return method.trim();
};

export const isCreditMethod = (method?: string | null) =>
  formatTransactionMethod(method) === "Credit";

export const isSystemGeneratedInitiator = (initiatedBy?: string | null) =>
  (initiatedBy ?? "").trim().toLowerCase() === "system generated";
