"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";

import type { EmployeeSelection } from "../../types";
import { formatMoney } from "../../utils";
import { formatSelectionSubmitted } from "../../utilsSelections";
import { SelectionStatusBadge } from "./SelectionStatusBadge";

export function EmployeeSelectionsTable({
  selections,
  selected,
  allVisibleSelected,
  onToggle,
  onToggleAll,
  onView,
}: {
  selections: EmployeeSelection[];
  selected: string[];
  allVisibleSelected: boolean;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onView: (selection: EmployeeSelection) => void;
}) {
  const currencySymbol = useWorkspaceCurrencySymbol();
  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="h-12 border-b border-gray-200 hover:bg-transparent">
            <TableHead className="w-12 px-6">
              <Checkbox
                checked={allVisibleSelected}
                onCheckedChange={onToggleAll}
                className="size-4 rounded border-gray-300 shadow-none"
                data-testid="employeeselectionstable-checkbox"
              />
            </TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {selections.map((selection) => (
            <TableRow
              key={selection.id}
              className="h-[72px] border-b border-gray-200 hover:bg-gray-50/50"
            >
              <TableCell className="w-12 px-6 py-4">
                <Checkbox
                  checked={selected.includes(selection.id)}
                  onCheckedChange={() => onToggle(selection.id)}
                  className="size-4 rounded border-gray-300 shadow-none"
                  data-testid="employeeselectionstable-checkbox-2"
                />
              </TableCell>
              <TableCell className="px-6 py-4">
                <p className="text-sm font-medium text-gray-900">
                  {selection.employeeName}
                </p>
                <p className="text-xs text-gray-500">
                  {selection.employeeRole} · {selection.employeeLevel} ·{" "}
                  {selection.employeeCountry}
                </p>
              </TableCell>
              <TableCell className="px-6 py-4 text-sm font-normal text-gray-700">
                {formatSelectionSubmitted(selection.submittedAt)}
              </TableCell>
              <TableCell className="px-6 py-4 text-sm font-normal text-gray-700 tabular-nums">
                {selection.items.length}
              </TableCell>
              <TableCell className="px-6 py-4 text-sm font-medium text-gray-900 tabular-nums">
                {formatMoney(selection.totalCost, currencySymbol)}
              </TableCell>
              <TableCell className="px-6 py-4">
                <SelectionStatusBadge status={selection.status} />
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onView(selection)}
                  className="text-sm font-medium text-primary-700 transition hover:text-primary-800"
                >
                  View
                </button>
              </TableCell>
            </TableRow>
          ))}
          {selections.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-32 text-center text-sm font-normal text-gray-500"
              >
                No selections match your filters
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}
