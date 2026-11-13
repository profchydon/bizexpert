"use client";

import Link from "next/link";
import { ArrowDown, ChevronsUpDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTableListLocation } from "@/hooks/tableListLocation";
import { withListLocation } from "@/utils/tableListPage";
import routes from "@/routes";

import type { CatalogRule, ConflictResult } from "../../types";
import { formatSpecificityTooltip, getRuleKits } from "../../utils";
import { RuleCardActions, RuleStatusBadges } from "./RuleCardParts";

export function RuleTable({
  rules,
  conflictsMap,
  onArchive,
  onConfigure,
  onDelete,
}: {
  rules: CatalogRule[];
  conflictsMap: Map<string, ConflictResult[]>;
  onArchive: (rule: CatalogRule) => void;
  onActivate: (rule: CatalogRule) => void;
  onConfigure: (rule: CatalogRule) => void;
  onDelete: (rule: CatalogRule) => void;
}) {
  const listLocation = useTableListLocation();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <Table className="min-w-[920px]">
        <TableHeader>
          <TableRow className="h-11 border-b border-gray-200 hover:bg-transparent">
            <TableHead className="px-6">
              <SortHeader label="Rule" />
            </TableHead>
            <TableHead className="px-6">
              <SortHeader label="Kit" />
            </TableHead>
            <TableHead className="px-6">Match criteria</TableHead>
            <TableHead className="px-6">
              <SortHeader label="Status" />
            </TableHead>
            <TableHead className="px-6">
              <SortHeader label="Specificity" active />
            </TableHead>
            <TableHead className="w-14 px-4" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => {
            const hasRedConflict = conflictsMap
              .get(rule.id)
              ?.some((conflict) => conflict.severity === "RED");

            return (
              <TableRow
                key={rule.id}
                className="h-[52px] border-b border-gray-200 hover:bg-gray-50/50"
              >
                <TableCell className="px-6 py-4">
                  <Link
                    className="text-sm font-medium text-primary-700 transition hover:text-primary-800 hover:underline"
                    href={withListLocation(
                      routes.CATALOG_POLICY_DETAIL(rule.id),
                      listLocation,
                    )}
                  >
                    {rule.name}
                  </Link>
                </TableCell>
                <TableCell className="max-w-[240px] px-6 py-4 text-sm font-normal text-gray-700">
                  <span className="block truncate" title={kitNames(rule)}>
                    {kitNames(rule)}
                  </span>
                </TableCell>
                <TableCell className="max-w-[360px] px-6 py-4">
                  <span
                    className="block truncate text-xs font-normal text-gray-500"
                    title={matchSummary(rule)}
                  >
                    {matchSummary(rule)}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <RuleStatusBadges rule={rule} />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span
                    title={formatSpecificityTooltip(rule)}
                    className={
                      hasRedConflict
                        ? "inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-error-50 px-2 text-xs font-medium text-error-700"
                        : "inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-medium text-gray-600"
                    }
                  >
                    {rule.specificityScore}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-4 text-right">
                  <RuleCardActions
                    rule={rule}
                    onArchive={onArchive}
                    onConfigure={onConfigure}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function SortHeader({ label, active }: { label: string; active?: boolean }) {
  const Icon = active ? ArrowDown : ChevronsUpDown;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
      {label}
      <Icon className="h-3 w-3 text-gray-400" />
    </span>
  );
}

function kitNames(rule: CatalogRule) {
  return getRuleKits(rule)
    .map((kit) => kit.name)
    .join(", ");
}

function matchSummary(rule: CatalogRule) {
  return [
    summarize("Roles", rule.matchRoles),
    summarize("Levels", rule.matchLevels),
    summarize("Depts", rule.matchDepartments),
    summarize("Countries", rule.matchCountries, "Global"),
  ].join(" · ");
}

function summarize(label: string, values: string[], allLabel = "All") {
  if (values.length === 0) return `${label}: ${allLabel}`;
  if (values.length <= 2) return `${label}: ${values.join(", ")}`;
  return `${label}: ${values.slice(0, 2).join(", ")} +${values.length - 2}`;
}
