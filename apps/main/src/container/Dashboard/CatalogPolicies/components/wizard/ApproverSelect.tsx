"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Search } from "lucide-react";

import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import { cn } from "@/lib/utils";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import type { IEmployees } from "@/types/employees";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  cacheSelectedEmployees,
  type PinnedApprover,
  selectedEmployeesFromCache,
  type SelectedEmployeeMap,
} from "./ApproverSelect.utils";
import { employeeName, PageButton, SelectedChip } from "./ApproverSelectParts";

const PER_PAGE = 20;

export function ApproverSelect({
  pinnedApprover,
  selected,
  onChange,
}: {
  pinnedApprover?: PinnedApprover;
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const { getCompanyDetails } = useAuthUserDetail();
  const companyId = useWorkspaceCompanyId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedById, setSelectedById] = useState<SelectedEmployeeMap>({});
  const query = useGetEmployeesQuery(
    {
      companyId: companyId!,
      params: { page, per_page: PER_PAGE, search: search || null },
    },
    { skip: !companyId },
  );
  const payload = query.data?.data;
  const employees = payload?.data ?? [];
  const lastPage = payload?.last_page ?? page;
  useEffect(() => {
    if (!employees.length) return;
    setSelectedById((current) =>
      cacheSelectedEmployees({ current, employees, selected }),
    );
  }, [employees, selected]);

  const selectedEmployees = useMemo(
    () => selectedEmployeesFromCache(selected, selectedById, pinnedApprover),
    [pinnedApprover, selected, selectedById],
  );

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  function toggle(employee: IEmployees) {
    const id = String(employee.id);
    if (!selected.includes(id)) {
      setSelectedById((current) => ({ ...current, [id]: employee }));
    }
    toggleId(id);
  }

  function toggleId(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id],
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Approvers</label>
      <div ref={wrapperRef} className="relative">
        <div className="min-h-11 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {selectedEmployees.length ? (
            <div className="flex flex-wrap gap-1.5 border-b border-gray-200 px-3 py-2">
              {selectedEmployees.map((employee) => (
                <SelectedChip
                  key={employee.id}
                  employee={employee}
                  pinned={String(employee.id) === String(pinnedApprover?.id)}
                  onRemove={() => toggleId(String(employee.id))}
                />
              ))}
            </div>
          ) : null}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <Search className="size-4 text-gray-400" />
            <input
              value={search}
              placeholder="Search employees"
              onFocus={() => setOpen(true)}
              onClick={() => setOpen(true)}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
                setOpen(true);
              }}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
        {open ? (
          <div className="absolute left-0 right-0 top-full z-[1030] mt-1.5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="max-h-60 overflow-y-auto py-1">
              {employees.map((employee) => {
                const id = String(employee.id);
                const active = selected.includes(id);
                const pinned = id === String(pinnedApprover?.id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => !pinned && toggle(employee)}
                    disabled={pinned}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50"
                  >
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded border",
                        active
                          ? "border-primary-600 bg-primary-600 text-white"
                          : "border-gray-300",
                      )}
                    >
                      {active ? <Check className="size-3" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-gray-900">
                        {employeeName(employee, pinned)}
                      </span>
                      <span className="block truncate text-xs text-gray-500">
                        {employee.email}
                      </span>
                    </span>
                  </button>
                );
              })}
              {!employees.length ? (
                <p className="px-3 py-3 text-sm text-gray-500">
                  {query.isFetching
                    ? "Loading employees..."
                    : "No employees found."}
                </p>
              ) : null}
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 px-3 py-2">
              <p className="text-xs text-gray-500">
                {selected.length} selected · Page {page}
              </p>
              <div className="flex gap-2">
                <PageButton
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="size-4" />
                </PageButton>
                <PageButton
                  disabled={page >= lastPage}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="size-4" />
                </PageButton>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <p className="text-sm text-gray-500">
        Select one or more employees who can approve matching orders.
      </p>
    </div>
  );
}
