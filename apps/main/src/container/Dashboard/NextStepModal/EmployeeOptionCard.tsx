import type { ComponentType } from "react";
import { cx } from "@/utils/cx";

interface EmployeeOptionCardProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  recommended: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export function EmployeeOptionCard({
  icon: Icon,
  title,
  description,
  recommended,
  isSelected,
  onClick,
}: EmployeeOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-3 text-left transition duration-100",
        isSelected
          ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
          : "border-secondary bg-primary hover:border-brand-300 hover:bg-brand-25",
      )}
    >
      <div
        className={cx(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          isSelected ? "bg-brand-100" : "bg-secondary",
        )}
      >
        <Icon
          className={cx(
            "size-[18px]",
            isSelected ? "text-brand-600" : "text-quaternary",
          )}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cx(
              "text-sm font-semibold",
              isSelected ? "text-brand-700" : "text-secondary",
            )}
          >
            {title}
          </span>
          {recommended && (
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
              Recommended
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-tertiary">{description}</p>
      </div>
    </button>
  );
}
