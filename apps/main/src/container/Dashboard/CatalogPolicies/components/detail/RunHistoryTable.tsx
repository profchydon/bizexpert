"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { RuleRunEntry } from "../../types";
import { formatTrigger } from "../../utils";
import { formatRunHistoryTime } from "../../utilsRunHistory";
import { RunOutcomeBadge } from "./RunOutcomeBadge";

export function RunHistoryTable({
  entries,
  onView,
}: {
  entries: RuleRunEntry[];
  onView: (entry: RuleRunEntry) => void;
}) {
  return (
    <div className="overflow-hidden">
      <Table className="min-w-[840px]">
        <TableHeader>
          <TableRow className="h-11 border-b border-gray-200 hover:bg-transparent">
            <TableHead className="px-6">Triggered at</TableHead>
            <TableHead className="px-6">Trigger</TableHead>
            <TableHead className="px-6">Employee</TableHead>
            <TableHead className="px-6">Outcome</TableHead>
            <TableHead className="px-6">Superseded by</TableHead>
            <TableHead className="px-6 text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.id}
              className="h-[72px] border-b border-gray-200 hover:bg-gray-50/50"
            >
              <TableCell className="px-6 py-4 text-sm font-normal text-gray-700">
                {formatRunHistoryTime(entry.triggeredAt)}
              </TableCell>
              <TableCell className="px-6 py-4 text-sm font-normal text-gray-700">
                {formatTrigger(entry.triggerType)}
              </TableCell>
              <TableCell className="px-6 py-4 text-sm font-normal text-gray-900">
                {entry.employeeName}
              </TableCell>
              <TableCell className="px-6 py-4">
                <RunOutcomeBadge outcome={entry.outcome} />
              </TableCell>
              <TableCell className="px-6 py-4 text-sm font-normal text-gray-700">
                {entry.supersededBy ?? "-"}
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <button
                  type="button"
                  className="text-sm font-medium text-primary-700 transition hover:text-primary-800"
                  onClick={() => onView(entry)}
                >
                  View
                </button>
              </TableCell>
            </TableRow>
          ))}
          {entries.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-sm font-normal text-gray-500"
              >
                No runs match your filters
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}
