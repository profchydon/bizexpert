export type TransactionDesignStatus =
  | "paid"
  | "pending"
  | "cancelled"
  | "failed"
  | "voided";

export type TransactionStatusColor =
  | "success"
  | "warning"
  | "error"
  | "gray"
  | "blue";

export type TransactionStatusMeta = {
  key: TransactionDesignStatus;
  label: string;
  color: TransactionStatusColor;
};

const STATUS_CONFIG: Record<TransactionDesignStatus, TransactionStatusMeta> = {
  paid: { key: "paid", label: "Paid", color: "success" },
  pending: { key: "pending", label: "Pending", color: "warning" },
  cancelled: { key: "cancelled", label: "Cancelled", color: "gray" },
  failed: { key: "failed", label: "Failed", color: "error" },
  voided: { key: "voided", label: "Voided", color: "blue" },
};

const API_TO_DESIGN: Record<string, TransactionDesignStatus> = {
  successful: "paid",
  fulfilled: "paid",
  paid: "paid",
  pending: "pending",
  "awaiting payment": "pending",
  disputed: "pending",
  open: "pending",
  draft: "pending",
  unpaid: "pending",
  overdue: "pending",
  failed: "failed",
  canceled: "cancelled",
  cancelled: "cancelled",
  refunded: "voided",
  "partial refund": "voided",
  void: "voided",
  uncollectible: "voided",
};

const normalizeStatus = (status?: string) => status?.trim().toLowerCase() ?? "";

export const getTransactionDesignStatus = (
  status?: string,
): TransactionDesignStatus | null =>
  API_TO_DESIGN[normalizeStatus(status)] ?? null;

export const getTransactionStatusMeta = (
  status?: string,
): TransactionStatusMeta => {
  const key = getTransactionDesignStatus(status);
  if (key) {
    return STATUS_CONFIG[key];
  }

  const label = status?.trim();
  return {
    key: "cancelled",
    label: label || "Unknown",
    color: "gray",
  };
};
