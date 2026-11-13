"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SearchWithIcon from "@/components/SearchWithIcon";
import Pagination from "@/components/Custom/Pagination";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import type { IEmployees } from "@/types/employees";
import { addEmployeeDisabledReason } from "./addEmployeeGuard";
import AddEmployeeRow from "./AddEmployeeRow";

const PER_PAGE = 20;

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  excludeIds: string[];
  onAdd: (employees: IEmployees[]) => void;
  requireAssignedDevices?: boolean;
  requireCountry?: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
}

const AddEmployeesModal: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  excludeIds,
  onAdd,
  requireAssignedDevices = true,
  requireCountry = false,
  title = "Add employees to off-board",
  description = "Pick more people to off-board. Employees already in this batch aren't shown.",
  confirmLabel = "Add to off-boarding",
}) => {
  const companyId = useWorkspaceCompanyId();

  const [search, setSearch] = useState("");
  const [searchValue] = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Record<string, IEmployees>>({});

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setPage(1);
      setSelected({});
    }
  }, [isOpen]);

  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  const { currentData, isFetching, isError } = useGetEmployeesQuery(
    {
      companyId: companyId as string,
      params: { search: searchValue || null, page, per_page: PER_PAGE },
    },
    { skip: !isOpen || !companyId },
  );

  const meta = currentData?.data;
  const excludeSet = useMemo(() => new Set(excludeIds), [excludeIds]);
  const employees = useMemo(
    () => (meta?.data ?? []).filter((item) => !excludeSet.has(String(item.id))),
    [meta?.data, excludeSet],
  );
  const currentPage = meta?.current_page ?? 1;
  const lastPage = meta?.last_page ?? 1;

  const disabledReasonFor = (employee: IEmployees) =>
    addEmployeeDisabledReason(employee, {
      requireAssignedDevices,
      requireCountry,
    });

  const toggle = (employee: IEmployees) => {
    if (disabledReasonFor(employee)) return;
    const id = String(employee.id);
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = employee;
      return next;
    });
  };

  const count = Object.keys(selected).length;
  const label =
    count === 1 ? "1 employee selected" : `${count} employees selected`;

  const handleAdd = () => {
    if (count === 0) return;
    onAdd(Object.values(selected));
    onOpenChange(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
      data-testid="addemployeesmodal-dialog"
    >
      <DialogContent className="flex max-h-[680px] max-w-[560px] flex-col gap-0 p-0">
        <div className="px-6 pb-4 pt-6">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-gray-600">
            {description}
          </DialogDescription>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4">
          <SearchWithIcon
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by employee name or country"
          />
          <p className="text-sm text-gray-500">{label}</p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto border-t border-gray-100">
          {isFetching ? (
            <p className="px-6 py-10 text-center text-sm text-gray-500">
              Loading employees…
            </p>
          ) : isError ? (
            <p className="px-6 py-10 text-center text-sm text-error-600">
              Couldn&apos;t load employees. Please try again.
            </p>
          ) : employees.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-gray-500">
              No employees found.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {employees.map((employee) => {
                const reason = disabledReasonFor(employee);
                return (
                  <AddEmployeeRow
                    key={String(employee.id)}
                    employee={employee}
                    selected={Boolean(selected[String(employee.id)])}
                    disabled={Boolean(reason)}
                    disabledReason={reason}
                    onToggle={() => toggle(employee)}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4">
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={setPage}
          />
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 px-4 text-sm font-semibold text-gray-700"
              onClick={() => onOpenChange(false)}
              data-testid="addemployeesmodal-button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              className="h-11 px-4 text-sm font-semibold"
              disabled={count === 0}
              onClick={handleAdd}
              data-testid="addemployeesmodal-button-2"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeesModal;
