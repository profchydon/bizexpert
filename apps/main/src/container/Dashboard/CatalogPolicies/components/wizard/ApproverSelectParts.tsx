import { X } from "lucide-react";

import type { IEmployees } from "@/types/employees";

export function SelectedChip({
  employee,
  pinned,
  onRemove,
}: {
  employee: IEmployees;
  pinned?: boolean;
  onRemove: () => void;
}) {
  const name = employeeName(employee, pinned);
  return (
    <span className="inline-flex max-w-[200px] items-center gap-1 rounded-md bg-gray-50 py-1 pl-2 pr-1 text-xs text-gray-700 ring-1 ring-gray-200">
      <span className="truncate">{name}</span>
      {pinned ? null : (
        <button type="button" aria-label={`Remove ${name}`} onClick={onRemove}>
          <X className="size-3.5 text-gray-400" />
        </button>
      )}
    </span>
  );
}

export function PageButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-lg border border-gray-300 text-gray-600 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function EmployeeAvatar({ employee }: { employee: IEmployees }) {
  const initials =
    [employee.first_name, employee.last_name]
      .filter(Boolean)
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AP";

  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
      {initials}
    </span>
  );
}

export function employeeName(employee: IEmployees, pinned?: boolean) {
  if (pinned) return "Admin (You)";
  return (
    [employee.first_name, employee.last_name].filter(Boolean).join(" ") ||
    employee.email ||
    "Unknown employee"
  );
}
