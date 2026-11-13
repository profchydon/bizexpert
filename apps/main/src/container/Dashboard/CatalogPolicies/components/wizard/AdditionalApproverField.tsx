"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import type { IEmployees } from "@/types/employees";
import { useAuthUserDetail } from "@/utils/useAuthUser";

import { EmployeeAvatar, employeeName } from "./ApproverSelectParts";
import { EmployeeDropdown } from "./AdditionalApproverDropdown";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

const PER_PAGE = 20;

export function AdditionalApproverField({
  excludeId,
  selectedIds,
  onChange,
}: {
  excludeId?: string;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const { getCompanyDetails } = useAuthUserDetail();
  const companyId = useWorkspaceCompanyId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedById, setSelectedById] = useState<Record<string, IEmployees>>(
    {},
  );
  const query = useGetEmployeesQuery(
    {
      companyId: companyId!,
      params: { page, per_page: PER_PAGE, search: search || null },
    },
    { skip: !companyId },
  );
  const payload = query.data?.data;
  const employees = (payload?.data ?? []).filter(
    (employee) => String(employee.id) !== String(excludeId),
  );
  const lastPage = payload?.last_page ?? page;
  const selectedEmployees = selectedIds
    .map((id) => selectedById[id])
    .filter((employee): employee is IEmployees => Boolean(employee));

  useEffect(() => {
    if (!selectedIds.length || !employees.length) return;
    setSelectedById((current) => {
      const next = { ...current };
      employees.forEach((employee) => {
        const id = String(employee.id);
        if (selectedIds.includes(id)) next[id] = employee;
      });
      return next;
    });
  }, [employees, selectedIds]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  function toggleEmployee(employee: IEmployees) {
    const id = String(employee.id);
    setSelectedById((current) => ({ ...current, [id]: employee }));
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id],
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        Additional persons
      </label>
      <div ref={wrapperRef} className="relative">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") setOpen(true);
          }}
          className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-left shadow-sm transition hover:border-gray-300"
        >
          {selectedEmployees.length ? (
            <div className="flex min-w-0 flex-1 flex-wrap gap-1 pr-7">
              {selectedEmployees.map((employee) => (
                <SelectedPersonPill
                  key={employee.id}
                  employee={employee}
                  onRemove={() =>
                    onChange(
                      selectedIds.filter((id) => id !== String(employee.id)),
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <>
              <span className="flex size-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Search className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-normal text-gray-700">
                  Select additional persons
                </span>
                <span className="block truncate text-sm text-gray-500">
                  Search employees
                </span>
              </span>
            </>
          )}
        </div>
        {selectedIds.length ? (
          <button
            type="button"
            aria-label="Clear additional persons"
            onClick={() => onChange([])}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="size-4" />
          </button>
        ) : null}
        {open ? (
          <EmployeeDropdown
            employees={employees}
            isFetching={query.isFetching}
            lastPage={lastPage}
            page={page}
            selectedIds={selectedIds}
            search={search}
            onPageChange={setPage}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onToggle={toggleEmployee}
          />
        ) : null}
      </div>
      <p className="text-sm text-gray-500">
        These people will be notified for sign-off on every matching order.
      </p>
    </div>
  );
}

function SelectedPersonPill({
  employee,
  onRemove,
}: {
  employee: IEmployees;
  onRemove: () => void;
}) {
  const name = employeeName(employee);
  return (
    <span className="inline-flex max-w-[220px] items-center gap-1 rounded-md bg-gray-50 py-0.5 pl-2 pr-1 text-sm font-normal text-gray-700 ring-1 ring-gray-200">
      <span className="truncate">{name}</span>
      <button
        type="button"
        aria-label={`Remove ${name}`}
        onClick={(event) => {
          event.stopPropagation();
          onRemove();
        }}
      >
        <X className="size-3.5 text-gray-400" />
      </button>
    </span>
  );
}
