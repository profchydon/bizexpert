import { cn } from "@/lib/utils";
import { formatPaymentStatus, formatSaleStatus } from "./saleFilterOptions";

const STATUS_CLASS: Record<string, string> = {
  completed: "border-success-200 bg-success-50 text-success-700",
  cancelled: "border-error-200 bg-error-50 text-error-700",
  refunded: "border-warning-200 bg-warning-50 text-warning-700",
};

const PAYMENT_CLASS: Record<string, string> = {
  paid: "border-success-200 bg-success-50 text-success-700",
  partial: "border-warning-200 bg-warning-50 text-warning-700",
  credit: "border-gray-200 bg-gray-50 text-gray-600",
};

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {label}
    </span>
  );
}

export function SaleStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      label={formatSaleStatus(status)}
      className={
        STATUS_CLASS[status] ?? "border-gray-200 bg-gray-50 text-gray-600"
      }
    />
  );
}

export function SalePaymentBadge({ status }: { status: string }) {
  return (
    <Badge
      label={formatPaymentStatus(status)}
      className={
        PAYMENT_CLASS[status] ?? "border-gray-200 bg-gray-50 text-gray-600"
      }
    />
  );
}
