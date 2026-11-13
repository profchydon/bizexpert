"use client";

import Pagination from "@/components/Custom/Pagination";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OfficeEmployee } from "../../types/officeEmployee";
import type { MemberSort } from "../utils/sortOfficeMembers";
import { toggleRowSelection } from "../utils/toggleRowSelection";
import { OfficeMemberTableHead } from "./OfficeMemberTableHead";
import { OfficeEmployeeAvatar } from "./OfficeEmployeeAvatar";

const columns = [
  {
    id: "name" as const,
    label: "Employee",
    tooltip: "The employee's name and country.",
  },
  {
    id: "role" as const,
    label: "Role",
    tooltip: "The employee's job title.",
  },
  {
    id: "dept" as const,
    label: "Department",
    tooltip: "The team the employee belongs to.",
  },
  {
    id: "email" as const,
    label: "Email",
    tooltip: "The employee's work email address.",
  },
];

interface Props {
  active: boolean;
  pageRows: OfficeEmployee[];
  sort: MemberSort;
  page: number;
  totalPages: number;
  showPagination: boolean;
  selected: Set<string>;
  onSortChange: (column: Exclude<MemberSort["column"], "">) => void;
  onPageChange: (page: number) => void;
  onApplySelection: (pageIds: string[], keys: "all" | Set<string>) => void;
}

export function OfficeEmployeesTable({
  active,
  pageRows,
  sort,
  page,
  totalPages,
  showPagination,
  selected,
  onSortChange,
  onPageChange,
  onApplySelection,
}: Props) {
  return (
    <>
      <div className="overflow-x-auto">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow>
              {active && (
                <TableHead className="w-12 px-6 py-3">
                  <Checkbox
                    checked={
                      pageRows.length > 0 &&
                      pageRows.every((row) => selected.has(row.id))
                    }
                    onCheckedChange={(checked) =>
                      onApplySelection(
                        pageRows.map((row) => row.id),
                        checked ? "all" : new Set(),
                      )
                    }
                    aria-label="Select all employees on this page"
                    data-testid="officeemployeestable-checkbox"
                  />
                </TableHead>
              )}
              <OfficeMemberTableHead
                columns={columns}
                sort={sort}
                onSortChange={onSortChange}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((employee) => (
              <TableRow
                key={employee.id}
                className={active ? "cursor-pointer" : undefined}
                onClick={() =>
                  active &&
                  onApplySelection(
                    pageRows.map((row) => row.id),
                    toggleRowSelection(selected, employee.id),
                  )
                }
              >
                {active && (
                  <TableCell className="px-6 py-4">
                    <Checkbox
                      checked={selected.has(employee.id)}
                      onClick={(event) => event.stopPropagation()}
                      onCheckedChange={() =>
                        onApplySelection(
                          pageRows.map((row) => row.id),
                          toggleRowSelection(selected, employee.id),
                        )
                      }
                      aria-label={`Select ${employee.name}`}
                      data-testid="officeemployeestable-checkbox-2"
                    />
                  </TableCell>
                )}
                <TableCell className="px-6 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <OfficeEmployeeAvatar initials={employee.initials} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">
                        {employee.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {employee.country}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-600">
                  {employee.role}
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-600">
                  {employee.dept}
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-600">
                  {employee.email}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="border-t border-gray-200 px-5 py-4">
          <Pagination
            currentPage={page}
            lastPage={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
}
