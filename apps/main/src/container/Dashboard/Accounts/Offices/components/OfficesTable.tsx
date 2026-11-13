"use client";

import { useMemo, useState, type ReactNode } from "react";
import Pagination from "@/components/Custom/Pagination";
import { TableBody, TableHeader, TableRow } from "@/components/ui/table";
import type { Office } from "../../types";
import {
  filterOffices,
  sortOffices,
  toggleOfficeSort,
  type OfficeSort,
} from "../utils/sortOffices";
import { AccountsTableHeader } from "../../components/AccountsTableHeader";
import { OfficeTableHeadRow } from "./OfficeTableHeadRow";
import { OfficeTableRow } from "./OfficeTableRow";
import { OfficesTableFilter } from "./OfficesTableFilter";
import { accountsTableCardClass } from "../../components/accountsTableToolbarClasses";

interface Props {
  offices: Office[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  action?: ReactNode;
}

export function OfficesTable({
  offices,
  total,
  page,
  totalPages,
  onPageChange,
  action,
}: Props) {
  const [sort, setSort] = useState<OfficeSort>({
    column: "",
    direction: "asc",
  });
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState<Office["type"][]>([]);

  const rows = useMemo(
    () => sortOffices(filterOffices(offices, query, types), sort),
    [offices, query, sort, types],
  );

  return (
    <div className={accountsTableCardClass}>
      <AccountsTableHeader
        title="Offices"
        count={total}
        countTooltip={`${total.toLocaleString("en-US")} office${total === 1 ? "" : "s"} across your entities.`}
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search office"
        searchAriaLabel="Search offices"
        filter={<OfficesTableFilter types={types} onChange={setTypes} />}
        action={action}
      />

      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full caption-bottom text-sm">
          <TableHeader>
            <TableRow>
              <OfficeTableHeadRow
                sort={sort}
                onSortChange={(column) => {
                  if (!column) return;
                  setSort((current) => toggleOfficeSort(current, column));
                }}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((office) => (
              <OfficeTableRow key={office.id} office={office} />
            ))}
          </TableBody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="px-6 py-10 text-center text-sm text-gray-600">
          No offices match your search.
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
    </div>
  );
}
