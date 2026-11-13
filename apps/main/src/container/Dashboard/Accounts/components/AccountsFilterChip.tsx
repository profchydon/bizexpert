import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  isSelected: boolean;
  label: string;
  onClick: () => void;
}

export function AccountsFilterChip({ isSelected, label, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        isSelected
          ? "border-primary-600 bg-primary-50 text-primary-700"
          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
      )}
    >
      {isSelected && <Check className="size-3.5" />}
      {label}
    </button>
  );
}
