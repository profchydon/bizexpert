import { CheckSquare } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { useApprovalsState } from "../useApprovalsState";
import { ApprovalsTable } from "./ApprovalsTable";
import { ApprovalsToolbar } from "./Toolbar";

type ApprovalState = ReturnType<typeof useApprovalsState>;

export function ApprovalsTableCard({ state }: { state: ApprovalState }) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <ApprovalsToolbar
        activeTab={state.activeTab}
        onSearchChange={state.setSearch}
        onTabChange={state.setActiveTab}
        resultCount={state.total}
        search={state.search}
      />
      {state.isLoading ? (
        <div className="px-4 py-16 text-center text-sm text-gray-500 md:px-6">
          Loading approval requests...
        </div>
      ) : state.records.length ? (
        <ApprovalsTable
          employees={state.employees}
          onSelect={state.setSelectedId}
          onSortChange={state.setSort}
          records={state.pageRecords}
          sort={state.sort}
        />
      ) : (
        <EmptyApprovals
          onClear={() => state.setSearch("")}
          search={state.search}
        />
      )}
      {state.totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-4 text-sm text-gray-600 md:px-6">
          <span>
            Page {state.page} of {state.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={state.page <= 1}
              onClick={() => state.setPage(state.page - 1)}
              data-testid="tablecard-button"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={state.page >= state.totalPages}
              onClick={() => state.setPage(state.page + 1)}
              data-testid="tablecard-button-2"
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function EmptyApprovals({
  onClear,
  search,
}: {
  onClear: () => void;
  search: string;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center md:px-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <CheckSquare className="h-5 w-5" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-gray-900">
        No approvals to review
      </h2>
      <p className="mt-1 max-w-md text-sm text-gray-500">
        {search
          ? "Try a different search or clear filters."
          : "When a catalog policy matches a new employee, the approval card will land here."}
      </p>
      {search ? (
        <Button
          variant="outline"
          className="mt-5"
          onClick={onClear}
          data-testid="tablecard-button-3"
        >
          Clear search
        </Button>
      ) : null}
    </div>
  );
}
