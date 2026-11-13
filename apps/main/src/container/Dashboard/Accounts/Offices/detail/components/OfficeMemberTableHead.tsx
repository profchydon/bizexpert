"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, CircleHelp } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MemberSort } from "../utils/sortOfficeMembers";

interface Column {
  id: Exclude<MemberSort["column"], "">;
  label: string;
  tooltip?: string;
  sortable?: boolean;
}

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: MemberSort["direction"];
}) {
  if (!active) {
    return <ArrowUpDown className="size-3 stroke-[2.5px] text-gray-400" />;
  }
  return direction === "asc" ? (
    <ArrowUp className="size-3 stroke-[2.5px] text-gray-500" />
  ) : (
    <ArrowDown className="size-3 stroke-[2.5px] text-gray-500" />
  );
}

interface Props {
  columns: Column[];
  sort: MemberSort;
  onSortChange: (column: Exclude<MemberSort["column"], "">) => void;
  showCheckbox?: boolean;
}

export function OfficeMemberTableHead({
  columns,
  sort,
  onSortChange,
  showCheckbox,
}: Props) {
  return (
    <TooltipProvider>
      {showCheckbox && (
        <TableHead className="w-12 px-6 py-3">
          <span className="sr-only">Select row</span>
        </TableHead>
      )}
      {columns.map((column) => (
        <TableHead key={column.id} className="whitespace-nowrap px-6 py-3">
          <div className="inline-flex items-center gap-1 whitespace-nowrap">
            {column.sortable === false ? (
              <span className="text-xs font-semibold whitespace-nowrap text-gray-500">
                {column.label}
              </span>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-1 whitespace-nowrap text-left text-xs font-semibold text-gray-500"
                onClick={() => onSortChange(column.id)}
              >
                {column.label}
                <SortIcon
                  active={sort.column === column.id}
                  direction={sort.direction}
                />
              </button>
            )}
            {column.tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={`${column.label} column help`}
                    className="inline-flex text-gray-400 transition hover:text-gray-600"
                  >
                    <CircleHelp className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs normal-case">
                  {column.tooltip}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TableHead>
      ))}
    </TooltipProvider>
  );
}
