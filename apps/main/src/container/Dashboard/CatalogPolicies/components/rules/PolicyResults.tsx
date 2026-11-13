"use client";

import Pagination from "@/components/Custom/Pagination";

import {
  EmptyPolicyState,
  EmptyRulesByStatus,
  FilteredRulesEmptyState,
} from "../layout/EmptyStates";
import { RuleCard, RuleLoadingSkeleton } from "./RuleLists";
import { RuleTable } from "./RuleTable";
import type {
  CatalogRule,
  RuleFilters,
  RulePagination,
  RuleStatusFilter,
  RuleView,
} from "../../types";
import { defaultRuleFilters } from "../../utils";
import type { detectConflicts } from "../../utils";

export function PolicyResults({
  isLoading,
  rules,
  filtered,
  view,
  statusFilter,
  filters,
  search,
  conflictsMap,
  onArchive,
  onActivate,
  onConfigure,
  onDelete,
  onCreateRule,
  onClearSearch,
  onFiltersChange,
  onStatusFilterChange,
  pagination,
}: {
  isLoading: boolean;
  rules: CatalogRule[];
  filtered: CatalogRule[];
  view: RuleView;
  statusFilter: RuleStatusFilter;
  filters: RuleFilters;
  search: string;
  conflictsMap: Map<string, ReturnType<typeof detectConflicts>>;
  onArchive: (rule: CatalogRule) => void;
  onActivate: (rule: CatalogRule) => void;
  onConfigure: (rule: CatalogRule) => void;
  onDelete: (rule: CatalogRule) => void;
  onCreateRule: () => void;
  onClearSearch: () => void;
  onFiltersChange: (filters: RuleFilters) => void;
  onStatusFilterChange: (status: RuleStatusFilter) => void;
  pagination: RulePagination;
}) {
  const hasSearchOrDimensionFilters =
    search.trim() !== "" ||
    filters.roles.length > 0 ||
    filters.levels.length > 0 ||
    filters.departments.length > 0 ||
    filters.countries.length > 0;

  if (isLoading) return <RuleLoadingSkeleton />;
  if (rules.length === 0 && hasSearchOrDimensionFilters) {
    return (
      <FilteredRulesEmptyState
        onClearFilters={() => {
          onClearSearch();
          onFiltersChange(defaultRuleFilters);
        }}
      />
    );
  }
  if (rules.length === 0 && statusFilter !== "All") {
    return (
      <EmptyRulesByStatus
        status={statusFilter}
        onCreateRule={onCreateRule}
        onViewDrafts={() => onStatusFilterChange("Draft")}
      />
    );
  }
  if (rules.length === 0)
    return <EmptyPolicyState onCreateRule={onCreateRule} />;
  if (filtered.length === 0 && hasSearchOrDimensionFilters) {
    return (
      <FilteredRulesEmptyState
        onClearFilters={() => {
          onClearSearch();
          onFiltersChange(defaultRuleFilters);
        }}
      />
    );
  }
  if (filtered.length === 0) {
    return (
      <EmptyRulesByStatus
        status={statusFilter}
        onCreateRule={onCreateRule}
        onViewDrafts={() => onStatusFilterChange("Draft")}
      />
    );
  }
  if (view === "table") {
    return (
      <>
        <RuleTable
          rules={filtered}
          conflictsMap={conflictsMap}
          onArchive={onArchive}
          onActivate={onActivate}
          onConfigure={onConfigure}
          onDelete={onDelete}
        />
        <PolicyListPagination pagination={pagination} />
      </>
    );
  }
  return (
    <>
      <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((rule) => (
          <RuleCard
            key={rule.id}
            rule={rule}
            conflicts={conflictsMap.get(rule.id) ?? []}
            onArchive={onArchive}
            onActivate={onActivate}
            onConfigure={onConfigure}
            onDelete={onDelete}
          />
        ))}
      </div>
      <PolicyListPagination pagination={pagination} />
    </>
  );
}

function PolicyListPagination({ pagination }: { pagination: RulePagination }) {
  return (
    <Pagination
      className="pt-2"
      currentPage={pagination.currentPage}
      lastPage={pagination.lastPage}
      onPageChange={pagination.onPageChange}
      prevLabel="Previous"
    />
  );
}
