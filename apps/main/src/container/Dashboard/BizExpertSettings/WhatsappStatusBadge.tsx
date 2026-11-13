import { cn } from "@/lib/utils";

export function WhatsappStatusBadge({ isVerified }: { isVerified: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
        isVerified
          ? "border-success-200 bg-success-50 text-success-700"
          : "border-warning-200 bg-warning-50 text-warning-700",
      )}
    >
      {isVerified ? "Verified" : "Pending VERIFY"}
    </span>
  );
}
