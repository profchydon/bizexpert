"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, CircleHelp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableHead } from "@/components/ui/table";
import type { SubsidiarySort } from "../types";
import { subsidiaryTableColumns } from "./subsidiaryTableColumns";
import {
  subsidiaryStickyActionHeadClass,
  subsidiaryTableHeadClass,
} from "./subsidiaryStickyActionColumn";

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: SubsidiarySort["direction"];
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
  sort: SubsidiarySort;
  onSortChange: (column: SubsidiarySort["column"]) => void;
}

export function SubsidiaryTableHeadRow({ sort, onSortChange }: Props) {
  return (
    <TooltipProvider>
      {subsidiaryTableColumns.map((column) => (
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
