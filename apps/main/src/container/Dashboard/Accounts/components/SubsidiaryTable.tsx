"use client";

import { useMemo, useState, type ReactNode } from "react";
import Pagination from "@/components/Custom/Pagination";
import PageState from "@/components/PageState";
import { TableBody, TableHeader, TableRow } from "@/components/ui/table";
import type { Subsidiary, SubsidiarySort, SubsidiaryStatus } from "../types";
import { sortSubsidiaries, toggleSort } from "../utils/sortSubsidiaries";
import { AccountsTableFilter } from "./AccountsTableFilter";
import { AccountsTableHeader } from "./AccountsTableHeader";
import { accountsTableCardClass } from "./accountsTableToolbarClasses";
import { SubsidiaryTableHeadRow } from "./SubsidiaryTableHeadRow";
import { SubsidiaryTableRow } from "./SubsidiaryTableRow";

interface Props {
  subsidiaries: Subsidiary[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  query: string;
  onQueryChange: (value: string) => void;
  statuses: SubsidiaryStatus[];
  onStatusesChange: (statuses: SubsidiaryStatus[]) => void;
  isListLoading?: boolean;
  isError?: boolean;
  hasActiveFilters?: boolean;
  action?: ReactNode;
}

export function SubsidiaryTable({
  subsidiaries,
  total,
  page,
  totalPages,
  onPageChange,
  query,
  onQueryChange,
  statuses,
  onStatusesChange,
  isListLoading = false,
  isError = false,
  hasActiveFilters = false,
  action,
}: Props) {
  const [sort, setSort] = useState<SubsidiarySort>({
    column: "",
    direction: "asc",
  });

  const rows = useMemo(
    () => sortSubsidiaries(subsidiaries, sort),
    [sort, subsidiaries],
  );

  const emptyMessage = hasActiveFilters
    ? "No entities match your search or filters."
    : "No entities match your search.";

  return (
    <div className={accountsTableCardClass}>
      <AccountsTableHeader
        title="Entities"
        count={total}
        countTooltip={`${total.toLocaleString("en-US")} entit${total === 1 ? "y" : "ies"} in this account.`}
        query={query}
        onQueryChange={onQueryChange}
        searchPlaceholder="Search entity"
        searchAriaLabel="Search entities"
        filter={
          <AccountsTableFilter
            statuses={statuses}
            onChange={onStatusesChange}
          />
        }
        action={action}
      />

      <PageState isLoading={isListLoading} isError={isError}>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full caption-bottom text-sm">
            <TableHeader>
              <TableRow>
                <SubsidiaryTableHeadRow
                  sort={sort}
                  onSortChange={(column) => {
                    if (!column) return;
                    setSort((current) => toggleSort(current, column));
                  }}
                />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((subsidiary) => (
                <SubsidiaryTableRow
                  key={subsidiary.id}
                  subsidiary={subsidiary}
                />
              ))}
            </TableBody>
          </table>
        </div>

        {rows.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-gray-600">
            {emptyMessage}
          </div>
        )}

        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-5 py-4">
            <Pagination
              currentPage={page}
              lastPage={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </PageState>
    </div>
  );
}
