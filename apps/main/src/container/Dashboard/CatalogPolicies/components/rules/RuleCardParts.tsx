"use client";

import type { ReactNode } from "react";
import {
  AlertCircle,
  Archive,
  Eye,
  GitBranch,
  LucideIcon,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useListDetailHref } from "@/hooks/tableListLocation";
import { useViewNavigation } from "@/hooks/useViewNavigation";
import routes from "@/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import type { CatalogRule, ConflictResult } from "../../types";

export function RuleStatusBadge({ status }: { status: CatalogRule["status"] }) {
  const tone = status === "ACTIVE" ? "green" : "gray";
  const label =
    status === "ACTIVE" ? "Active" : status === "DRAFT" ? "Draft" : "Archived";

  return <RulePill tone={tone}>{label}</RulePill>;
}

export function RuleStatusBadges({ rule }: { rule: CatalogRule }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <RulePill tone={rule.selectionMode === "FIXED" ? "blue" : "purple"}>
        {rule.selectionMode === "FIXED" ? "Fixed" : "Open"}
      </RulePill>
      <RuleStatusBadge status={rule.status} />
    </div>
  );
}

function RulePill({
  tone,
  children,
}: {
  tone: "blue" | "purple" | "green" | "gray";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full border px-2 text-xs font-normal",
        tone === "blue" && "border-primary-200 bg-primary-50 text-primary-700",
        tone === "purple" && "border-purple-200 bg-purple-50 text-purple-700",
        tone === "green" && "border-success-200 bg-success-50 text-success-700",
        tone === "gray" && "border-gray-200 bg-gray-50 text-gray-600",
      )}
    >
      {children}
    </span>
  );
}

export function RuleCardActions({
  rule,
  onArchive,
  onConfigure,
  onDelete,
}: {
  rule: CatalogRule;
  onArchive: (rule: CatalogRule) => void;
  onConfigure: (rule: CatalogRule) => void;
  onDelete: (rule: CatalogRule) => void;
}) {
  const { view, isPending } = useViewNavigation();
  const viewHref = useListDetailHref(routes.CATALOG_POLICY_DETAIL(rule.id));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl text-gray-500 data-[state=open]:border-2 data-[state=open]:border-primary-600 data-[state=open]:bg-white"
          isLoading={isPending}
          data-testid="rulecardparts-button"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-44 rounded-xl border border-gray-200 bg-white p-3 shadow-lg"
      >
        <RuleActionItem
          icon={Eye}
          label="View"
          onClick={() => view(viewHref)}
        />
        {/* <RuleActionItem
          icon={Pencil}
          label="Edit"
          onClick={() => router.push(routes.CATALOG_POLICY_EDIT(rule.id))}
        /> */}
        <RuleActionItem
          icon={GitBranch}
          label="Add sub policy"
          onClick={() => onConfigure(rule)}
        />
        <RuleActionItem
          icon={Archive}
          label={rule.status === "ARCHIVED" ? "Unarchive" : "Archive"}
          onClick={() => onArchive(rule)}
        />
        <DropdownMenuSeparator className="-mx-1 my-1 bg-gray-200" />
        <RuleActionItem
          icon={Trash2}
          label="Delete"
          onClick={() => onDelete(rule)}
          tone="danger"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RuleActionItem({
  icon: Icon,
  label,
  onClick,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
}) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className={cn(
        "h-10 cursor-pointer gap-3 rounded-lg px-2 text-sm font-medium outline-none focus:bg-gray-50",
        tone === "danger" ? "text-error-700" : "text-gray-700",
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0",
          tone === "danger" ? "text-error-500" : "text-gray-400",
        )}
      />
      <span className="truncate">{label}</span>
    </DropdownMenuItem>
  );
}

export function CriteriaRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 shrink-0 text-xs text-gray-400">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

export function RedConflictMessage({ conflict }: { conflict: ConflictResult }) {
  return (
    <div className="mt-2 flex items-start gap-2 px-1 text-xs text-error-700">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <p>
        Conflicts with {conflict.conflictingRuleName} at equal specificity for{" "}
        {conflict.overlapDescription}.
      </p>
    </div>
  );
}
