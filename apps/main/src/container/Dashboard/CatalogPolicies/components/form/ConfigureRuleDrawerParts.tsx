"use client";

import type { ReactNode } from "react";
import { Eye, GitBranch, Package, Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { CatalogRule } from "../../types";
import { summarizeChildRule } from "../../utilsChildRuleSummary";

export function ConfigureRuleDrawerHeader({
  parent,
  seededTotal,
  savedCount,
  onClose,
}: {
  parent: CatalogRule;
  seededTotal: number;
  savedCount: number;
  onClose: () => void;
}) {
  const isSeeded = seededTotal > 0;
  const allDone = isSeeded && savedCount >= seededTotal;

  return (
    <header className="px-6 pb-5 pt-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold leading-7 text-gray-900">
            {isSeeded ? "Sub policy required for each kit" : "Add sub policy"}
          </h2>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            {isSeeded
              ? "Each kit you selected needs its own sub policy. Open each row below and add at least one match criterion to assign it to a specific group of employees."
              : "Each row creates a new catalog policy that inherits from this one and overrides one or more settings."}
          </p>
        </div>
        <div className="flex shrink-0 items-start gap-2">
          {isSeeded ? (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                allDone
                  ? "bg-success-50 text-success-700 ring-success-200"
                  : "bg-warning-50 text-warning-700 ring-warning-200",
              )}
            >
              {savedCount} of {seededTotal} saved
            </span>
          ) : null}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600">
        <GitBranch className="size-3.5 shrink-0 text-primary-600" />
        <span className="truncate">{parent.name}</span>
      </div>
    </header>
  );
}

export function ConfigureRuleEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-8 text-center">
      <div className="rounded-full bg-primary-50 p-2.5 text-primary-600">
        <GitBranch className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-900">No sub policy yet</p>
        <p className="text-sm leading-5 text-gray-500">
          Start by adding one to extend or override this policy.
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        className="gap-2"
        onClick={onAdd}
        data-testid="configureruledrawerparts-button"
      >
        <Plus className="h-4 w-4" />
        Add sub policy
      </Button>
    </div>
  );
}

export function SubRuleCard({
  index,
  rule,
  onView,
  onEdit,
  onRemove,
}: {
  index: number;
  rule: CatalogRule;
  onView: () => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
        <Package className="size-[18px]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Rule {index + 1}
        </p>
        <p className="mt-1 truncate text-sm font-medium text-gray-900">
          {rule.name}
        </p>
        <p className="mt-1 truncate text-xs font-normal leading-5 text-gray-500">
          {summarizeChildRule(rule)}
        </p>
      </div>
      <div className="flex shrink-0 gap-1 text-gray-400">
        <IconButton label="View rule" onClick={onView}>
          <Eye className="h-4 w-4" />
        </IconButton>
        <IconButton label="Edit rule" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </IconButton>
        <IconButton label="Remove rule" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
    >
      {children}
    </button>
  );
}
