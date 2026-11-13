"use client";

import { ChevronDown, Download, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";

import type { RuleRunEntry, RuleStatus, RunOutcome } from "../../types";
import { useRunHistoryExport } from "../../useRunHistoryExport";
import { filterRunHistoryEntries } from "../../utils";
import type { RunOutcomeFilter } from "../../utilsRunHistory";
import { CloudEmptyStateIllustration } from "./CloudEmptyStateIllustration";
import { RunDetailDrawer } from "./RunDetailDrawer";
import { RunHistoryTable } from "./RunHistoryTable";

const OUTCOME_OPTIONS: { value: RunOutcomeFilter; label: string }[] = [
  { value: "ALL", label: "All outcomes" },
  { value: "MATCHED", label: "Matched" },
  { value: "SUPERSEDED", label: "Superseded" },
  { value: "FAILED", label: "Failed" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "POLICY_UNMATCHED", label: "Policy Unmatched" },
];

export function RunHistorySection({
  catalogId,
  entries,
  isLoading = false,
  status,
  onActivate,
}: {
  catalogId?: string;
  entries: RuleRunEntry[];
  isLoading?: boolean;
  status: RuleStatus;
  onActivate: () => void;
}) {
  const [search, setSearch] = useState("");
  const [outcome, setOutcome] = useState<RunOutcomeFilter>("ALL");
  const [selectedEntry, setSelectedEntry] = useState<RuleRunEntry | null>(null);
  const filtered = useMemo(
    () => filterRunHistoryEntries({ entries, search, outcome }),
    [entries, search, outcome],
  );
  const { exportHistory, isExporting } = useRunHistoryExport(catalogId);

  if (entries.length === 0 && isLoading) {
    return (
      <section className="grid min-h-[330px] place-content-center rounded-xl border border-gray-200 bg-white px-6 py-16 shadow-sm">
        <Loader />
      </section>
    );
  }

  if (entries.length === 0) {
    return (
      <RuleNotTriggeredEmptyState status={status} onActivate={onActivate} />
    );
  }

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col items-start gap-4 border-b border-gray-200 bg-white px-4 py-5 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Run history</h2>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-50 px-1.5 text-xs font-medium text-primary-700 ring-1 ring-primary-100">
              {filtered.length}
            </span>
          </div>
          <div className="ml-auto flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[260px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search employee..."
                className="h-10 rounded-lg pl-9 text-sm font-normal shadow-none"
                data-testid="history-input"
              />
            </div>
            <div className="relative w-full sm:w-[160px]">
              <select
                value={outcome}
                onChange={(event) =>
                  setOutcome(event.target.value as RunOutcome | "ALL")
                }
                className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white py-0 pl-3 pr-9 text-sm font-medium text-gray-700 shadow-sm outline-none"
              >
                {OUTCOME_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-700" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 gap-2 rounded-lg px-3 text-sm font-medium text-gray-700"
              disabled={isExporting}
              onClick={() => exportHistory({ outcome, search })}
              data-testid="history-button"
            >
              <Download className="size-4" />
              {isExporting ? "Exporting..." : "Export to CSV"}
            </Button>
          </div>
        </div>
        <RunHistoryTable entries={filtered} onView={setSelectedEntry} />
      </section>
      <RunDetailDrawer
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </>
  );
}

function RuleNotTriggeredEmptyState({
  status,
  onActivate,
}: {
  status: RuleStatus;
  onActivate: () => void;
}) {
  const copy = {
    DRAFT: {
      title: "This rule isn't active yet",
      description: "Activate the rule to start provisioning devices.",
    },
    ACTIVE: {
      title: "Not yet triggered",
      description: "This rule is active but hasn't matched any employees yet.",
    },
    ARCHIVED: {
      title: "This rule is archived",
      description:
        "Archived rules don't run. Unarchive from the page header to resume provisioning.",
    },
  }[status];

  return (
    <section className="flex min-h-[330px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
      <div className="mb-5">
        <CloudEmptyStateIllustration />
      </div>
      <h2 className="text-base font-semibold leading-6 text-gray-900">
        {copy.title}
      </h2>
      <p className="mt-2 max-w-[360px] text-sm leading-5 text-gray-500">
        {copy.description}
      </p>
      {status === "DRAFT" ? (
        <div className="mt-6 flex items-center gap-3">
          <Button
            className="h-10 rounded-lg px-4 text-sm font-semibold"
            onClick={onActivate}
            data-testid="history-button-2"
          >
            Activate Policy
          </Button>
        </div>
      ) : null}
    </section>
  );
}
