import { Check, ChevronLeft, ChevronRight, Search } from "lucide-react";

import type { IEmployees } from "@/types/employees";

import {
  EmployeeAvatar,
  employeeName,
  PageButton,
} from "./ApproverSelectParts";

export function EmployeeDropdown({
  employees,
  isFetching,
  lastPage,
  page,
  search,
  selectedIds,
  onPageChange,
  onSearchChange,
  onToggle,
}: {
  employees: IEmployees[];
  isFetching: boolean;
  lastPage: number;
  page: number;
  search: string;
  selectedIds: string[];
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onToggle: (employee: IEmployees) => void;
}) {
  return (
    <div className="absolute left-0 right-0 top-full z-[1030] mt-1.5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2.5">
        <Search className="size-4 text-gray-400" />
        <input
          value={search}
          autoFocus
          placeholder="Search employees"
          onChange={(event) => onSearchChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>
      <div className="max-h-60 overflow-y-auto py-1">
        {employees.map((employee) => {
          const id = String(employee.id);
          const active = selectedIds.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => onToggle(employee)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50"
            >
              <EmployeeAvatar employee={employee} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-normal text-gray-900">
                  {employeeName(employee)}
                </span>
                <span className="block truncate text-xs text-gray-500">
                  {employee.job_title || employee.email}
                </span>
              </span>
              {active ? <Check className="size-4 text-primary-600" /> : null}
            </button>
          );
        })}
        {!employees.length ? (
          <p className="px-3 py-3 text-sm text-gray-500">
            {isFetching ? "Loading employees..." : "No employees found."}
          </p>
        ) : null}
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 px-3 py-2">
        <p className="text-xs text-gray-500">Page {page}</p>
        <div className="flex gap-2">
          <PageButton
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </PageButton>
          <PageButton
            disabled={page >= lastPage}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="size-4" />
          </PageButton>
        </div>
      </div>
    </div>
  );
}
