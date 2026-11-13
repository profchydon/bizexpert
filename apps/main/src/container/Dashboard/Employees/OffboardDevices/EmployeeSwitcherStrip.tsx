import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/utils/getInitials";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { resolveCountryText } from "@/utils/resolveCountryText";
import type { IEmployees } from "@/types/employees";

export interface OffboardEmployeeBasic {
  id: string;
  name: string;
  role?: string;
  country?: string;
}

export const toBasicEmployees = (
  employees: IEmployees[] | undefined,
): OffboardEmployeeBasic[] =>
  (employees ?? []).map((employee) => ({
    id: String(employee.id),
    name: `${employee.first_name} ${employee.last_name}`.trim(),
    role: employee.job_title || removeUserscore(employee.level || ""),
    country: resolveCountryText(employee.country),
  }));

interface Props {
  employees: OffboardEmployeeBasic[];
  currentIndex: number;
  onSwitch: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onAdd?: () => void;
  onRemoveEmployee?: (id: string) => void;
}

const EmployeeSwitcherStrip: React.FC<Props> = ({
  employees,
  currentIndex,
  onSwitch,
  onPrev,
  onNext,
  onAdd,
  onRemoveEmployee,
}) => {
  const total = employees.length;
  const current = employees[currentIndex];
  const canRemove = total > 1;
  const showNav = total > 1;

  if (!current) return null;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg outline-none">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gray-100 text-gray-600">
                {getInitials(current.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Switch employee
              </p>
              <p className="truncate text-sm font-semibold text-gray-900">
                {current.name}
              </p>
              <p className="truncate text-xs text-gray-500">
                {[current.role, current.country].filter(Boolean).join(" · ")}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            {employees.map((employee, index) => (
              <DropdownMenuItem
                key={employee.id}
                onClick={() => onSwitch(index)}
                className="flex items-center gap-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-100 text-xs text-gray-600">
                    {getInitials(employee.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {employee.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {[employee.role, employee.country]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                {onRemoveEmployee && (
                  <button
                    type="button"
                    aria-label={`Remove ${employee.name}`}
                    className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      onRemoveEmployee(employee.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden h-9 w-px shrink-0 bg-gray-200 md:block" />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 gap-2 px-3 text-sm font-semibold text-gray-700"
            onClick={() => onAdd?.()}
            data-testid="employeeswitcherstrip-button"
          >
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
          {canRemove && (
            <Button
              type="button"
              variant="outline"
              className="h-9 gap-2 px-3 text-sm font-semibold text-gray-700"
              onClick={() => onRemoveEmployee?.(current.id)}
              data-testid="employeeswitcherstrip-button-2"
            >
              <UserMinus className="h-4 w-4" />
              Remove employee
            </Button>
          )}
        </div>
      </div>

      {showNav && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 w-9 p-0"
            disabled={currentIndex === 0}
            onClick={onPrev}
            aria-label="Previous employee"
            data-testid="employeeswitcherstrip-button-3"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Badge variant="gray" className="rounded-full px-3 py-1">
            {currentIndex + 1} of {total} employees
          </Badge>
          <Button
            type="button"
            variant="outline"
            className="h-9 w-9 p-0"
            disabled={currentIndex === total - 1}
            onClick={onNext}
            aria-label="Next employee"
            data-testid="employeeswitcherstrip-button-4"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmployeeSwitcherStrip;
