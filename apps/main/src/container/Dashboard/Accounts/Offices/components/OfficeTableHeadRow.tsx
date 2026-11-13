"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, CircleHelp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableHead } from "@/components/ui/table";
import type { OfficeSort } from "../utils/sortOffices";
import { officesTableColumns } from "./officesTableColumns";
import {
  subsidiaryStickyActionHeadClass,
  subsidiaryTableHeadClass,
} from "../../components/subsidiaryStickyActionColumn";

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: OfficeSort["direction"];
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
  sort: OfficeSort;
  onSortChange: (column: OfficeSort["column"]) => void;
}

export function OfficeTableHeadRow({ sort, onSortChange }: Props) {
  return (
    <TooltipProvider>
      {officesTableColumns.map((column) => (
        <TableHead key={column.id} className={subsidiaryTableHeadClass}>
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-left text-xs font-semibold text-gray-500"
              onClick={() => onSortChange(column.id)}
            >
              {column.label}
              <SortIcon
                active={sort.column === column.id}
                direction={sort.direction}
              />
            </button>
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
          </div>
        </TableHead>
      ))}
      <TableHead className={subsidiaryStickyActionHeadClass}>
        <span className="sr-only">Actions</span>
      </TableHead>
    </TooltipProvider>
  );
}
