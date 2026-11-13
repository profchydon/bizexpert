"use client";

import { FileSearch, Plus, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { RuleStatusFilter } from "../../types";

function EmptyShell({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-6 w-6 text-gray-500" />
      </div>
      <h2 className="text-lg font-semibold text-gray-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function EmptyPolicyState({
  onCreateRule,
}: {
  onCreateRule: () => void;
}) {
  return (
    <EmptyShell
      icon={FileSearch}
      title="No policy rules yet"
      body="Create your first Catalog Policy rule to control employee kit eligibility."
      action={
        <Button
          onClick={onCreateRule}
          className="gap-2 text-sm"
          data-testid="emptystates-button"
        >
          <Plus className="h-4 w-4" />
          Add policy
        </Button>
      }
    />
  );
}

export function FilteredRulesEmptyState({
  onClearFilters,
}: {
  onClearFilters: () => void;
}) {
  return (
    <EmptyShell
      icon={SearchX}
      title="No rules match your filters"
      body="Clear your search or filters to see more Catalog Policy rules."
      action={
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="text-sm"
          data-testid="emptystates-button-2"
        >
          Clear filters
        </Button>
      }
    />
  );
}

export function EmptyRulesByStatus({
  status,
  onCreateRule,
  onViewDrafts,
}: {
  status: RuleStatusFilter;
  onCreateRule: () => void;
  onViewDrafts: () => void;
}) {
  return (
    <EmptyShell
      icon={FileSearch}
      title={`No ${status.toLowerCase()} rules`}
      body="Switch status views or add a new rule to continue."
      action={
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            onClick={onCreateRule}
            className="text-sm"
            data-testid="emptystates-button-3"
          >
            Add policy
          </Button>
          <Button
            variant="outline"
            onClick={onViewDrafts}
            className="text-sm"
            data-testid="emptystates-button-4"
          >
            View drafts
          </Button>
        </div>
      }
    />
  );
}
