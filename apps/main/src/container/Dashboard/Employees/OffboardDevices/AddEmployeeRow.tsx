import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { getInitials } from "@/utils/getInitials";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { cn } from "@/lib/utils";
import { resolveCountryText } from "@/utils/resolveCountryText";
import type { IEmployees } from "@/types/employees";

interface Props {
  employee: IEmployees;
  selected: boolean;
  disabled?: boolean;
  disabledReason?: string;
  onToggle: () => void;
}

const AddEmployeeRow: React.FC<Props> = ({
  employee,
  selected,
  disabled = false,
  disabledReason = "No assigned devices",
  onToggle,
}) => {
  const name = `${employee.first_name} ${employee.last_name}`.trim();
  const role = employee.job_title || removeUserscore(employee.level || "");

  const countryName = resolveCountryText(employee.country);
  const handleToggle = () => {
    if (disabled) return;
    onToggle();
  };

  return (
    <div
      role="button"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onMouseDown={(event) => event.preventDefault()}
      onClick={handleToggle}
      onKeyDown={(event) => {
        if (disabled) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      }}
      className={cn(
        "flex w-full items-center gap-3 px-6 py-3 text-left outline-none",
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:bg-gray-50 focus-visible:bg-gray-50",
      )}
    >
      <Checkbox
        checked={selected}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none h-5 w-5"
        data-testid="addemployeerow-checkbox"
      />
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-gray-100 text-xs text-gray-600">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{name}</p>
        {disabled ? (
          <p className="truncate text-xs text-gray-400">{disabledReason}</p>
        ) : role ? (
          <p className="truncate text-xs text-gray-500">{role}</p>
        ) : null}
      </div>
      {countryName ? (
        <p className="shrink-0 text-sm text-gray-500">{countryName}</p>
      ) : null}
    </div>
  );
};

export default AddEmployeeRow;
