import { cn } from "@/lib/utils";

export function ProductStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
        isActive
          ? "border-success-200 bg-success-50 text-success-700"
          : "border-gray-200 bg-gray-50 text-gray-600",
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
