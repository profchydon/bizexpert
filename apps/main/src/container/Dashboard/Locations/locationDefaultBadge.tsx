import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function LocationDefaultBadge({ isDefault }: { isDefault: boolean }) {
  if (!isDefault) {
    return <span className="whitespace-nowrap text-sm text-gray-400">—</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex cursor-default items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
        "border-success-200 bg-success-50 text-success-700",
      )}
    >
      <Check className="size-3" />
      Default
    </span>
  );
}
