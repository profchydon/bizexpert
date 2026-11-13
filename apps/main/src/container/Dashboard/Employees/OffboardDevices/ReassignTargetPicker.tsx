"use client";

import React, { useEffect, useMemo, useState } from "react";
import { UserPlus } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SearchWithIcon from "@/components/SearchWithIcon";
import Pagination from "@/components/Custom/Pagination";
import { getInitials } from "@/utils/getInitials";
import { removeUserscore } from "@/utils/underScoreTransformer";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import type { IEmployees } from "@/types/employees";
import type { ReassignTarget } from "./offboardPricing";
import { resolveCountryText } from "@/utils/resolveCountryText";

const PER_PAGE = 20;

interface Props {
  sourceCountry?: string;
  excludeIds: string[];
  value?: ReassignTarget;
  onSelect: (target: ReassignTarget) => void;
  renderTrigger?: () => React.ReactNode;
}

const ReassignTargetPicker: React.FC<Props> = ({
  sourceCountry,
  excludeIds,
  value,
  onSelect,
  renderTrigger,
}) => {
  const companyId = useWorkspaceCompanyId();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchValue] = useDebounce(query, 400);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (open) {
      setQuery("");
      setPage(1);
    }
  }, [open]);

  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  const countryFilter = resolveCountryText(sourceCountry);
  const search = searchValue.trim() || countryFilter || null;

  const { currentData, isFetching, isError } = useGetEmployeesQuery(
    {
      companyId: companyId as string,
      params: { search, page, per_page: PER_PAGE },
    },
    { skip: !open || !companyId },
  );

  const meta = currentData?.data;
  const excludeSet = useMemo(() => new Set(excludeIds), [excludeIds]);
  const candidates = useMemo(
    () =>
      (meta?.data ?? []).filter((item) => {
        if (excludeSet.has(String(item.id))) return false;
        if (countryFilter && resolveCountryText(item.country) !== countryFilter)
          return false;
        return true;
      }),
    [meta?.data, excludeSet, countryFilter],
  );
  const currentPage = meta?.current_page ?? 1;
  const lastPage = meta?.last_page ?? 1;

  const handleSelect = (employee: IEmployees) => {
    onSelect({
      id: String(employee.id),
      name: `${employee.first_name} ${employee.last_name}`.trim(),
      role: employee.job_title || removeUserscore(employee.level || ""),
      country: resolveCountryText(employee.country),
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {renderTrigger ? (
          renderTrigger()
        ) : (
          <Button
            type="button"
            variant="outline"
            className="h-9 w-full justify-start gap-2 px-3 text-sm font-semibold text-gray-700"
            data-testid="reassigntargetpicker-button"
          >
            <UserPlus className="h-4 w-4 shrink-0 text-gray-500" />
            <span className="truncate">{value?.name || "Pick employee"}</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-3">
        <SearchWithIcon
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or role"
        />
        <div className="mt-2 flex max-h-72 flex-col overflow-y-auto">
          {isFetching ? (
            <p className="px-2 py-6 text-center text-sm text-gray-500">
              Loading…
            </p>
          ) : isError ? (
            <p className="px-2 py-6 text-center text-sm text-error-600">
              Couldn&apos;t load employees.
            </p>
          ) : candidates.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-gray-500">
              No matching employees.
            </p>
          ) : (
            candidates.map((employee) => {
              const name =
                `${employee.first_name} ${employee.last_name}`.trim();
              const role =
                employee.job_title || removeUserscore(employee.level || "");
              return (
                <button
                  key={String(employee.id)}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(employee)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-gray-50"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-100 text-xs text-gray-600">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {[role, resolveCountryText(employee.country)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          onPageChange={setPage}
          className="mt-2"
        />
      </PopoverContent>
    </Popover>
  );
};

export default ReassignTargetPicker;
