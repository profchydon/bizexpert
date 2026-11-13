import { CheckSquare, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ApprovalEmployee, ApprovalRecord, ApprovalSort } from "../types";
import { ApprovalsTable } from "./ApprovalsTable";

type AwaitingState = {
  employees: Map<string, ApprovalEmployee>;
  isLoading: boolean;
  page: number;
  pageRecords: ApprovalRecord[];
  records: ApprovalRecord[];
  search: string;
  sort: ApprovalSort;
  total: number;
  totalPages: number;
  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  setSelectedId: (id: string | null) => void;
  setSort: (sort: ApprovalSort) => void;
};

export function AwaitingApprovalsCard({ state }: { state: AwaitingState }) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div className="relative z-0 inline-flex w-max -space-x-px rounded-lg shadow-sm">
          <button
            type="button"
            className="z-10 inline-flex items-center rounded-lg bg-gray-50 px-3.5 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-200"
          >
            Awaiting
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 items-center rounded-md border border-gray-200 bg-white px-3 text-sm font-normal text-gray-700 shadow-sm">
            {state.total} {state.total === 1 ? "result" : "results"}
          </span>
          <label className="relative block min-w-0 flex-1 sm:w-72 sm:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={state.search}
              onChange={(event) => state.setSearch(event.target.value)}
              placeholder="Search by employee, kit, or policy"
              className="h-9 w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm font-normal text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100"
            />
          </label>
        </div>
      </div>
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
        <EmptyAwaitingApprovals
          search={state.search}
          onClear={state.setSearch}
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
              data-testid="awaitingapprovalscard-button"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={state.page >= state.totalPages}
              onClick={() => state.setPage(state.page + 1)}
              data-testid="awaitingapprovalscard-button-2"
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function EmptyAwaitingApprovals({
  onClear,
  search,
}: {
  onClear: (value: string) => void;
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
          : "Pending catalog policy order requests will appear here."}
      </p>
      {search ? (
        <Button
          variant="outline"
          className="mt-5"
          onClick={() => onClear("")}
          data-testid="awaitingapprovalscard-button-3"
        >
          Clear search
        </Button>
      ) : null}
    </div>
  );
}
