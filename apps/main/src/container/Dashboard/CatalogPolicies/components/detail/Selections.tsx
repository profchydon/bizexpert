"use client";

import { useMemo, useState } from "react";
import { CheckCircle, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { EmployeeSelection } from "../../types";
import {
  getEmployeeSelectionGroups,
  type SelectionTabKey,
} from "../../utilsSelections";
import { EmployeeSelectionDetailDrawer } from "./EmployeeSelectionDetailDrawer";
import { EmployeeSelectionsTable } from "./EmployeeSelectionsTable";
import { RequestChangesModal } from "./RequestChangesModal";
import { SelectionTabButton } from "./SelectionTabButton";

export function EmployeeSelectionsSection({
  selections,
  onApprove,
  onApproveMany,
  onRequestChanges,
}: {
  selections: EmployeeSelection[];
  onApprove: (id: string) => void;
  onApproveMany: (ids: string[]) => void;
  onRequestChanges: (id: string, notes: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<SelectionTabKey>("REVIEW");
  const [selected, setSelected] = useState<string[]>([]);
  const [activeSelection, setActiveSelection] =
    useState<EmployeeSelection | null>(null);
  const [requestingChangesFor, setRequestingChangesFor] =
    useState<EmployeeSelection | null>(null);

  const { searched, approved, inReview } = useMemo(
    () => getEmployeeSelectionGroups(selections, search),
    [selections, search],
  );
  const visible = activeTab === "APPROVED" ? approved : inReview;
  const selectedVisible = selected.filter((id) =>
    visible.some((selection) => selection.id === id),
  );
  const allVisibleSelected =
    visible.length > 0 &&
    visible.every((selection) => selected.includes(selection.id));

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  function toggleAll() {
    setSelected((current) => {
      if (allVisibleSelected) {
        return current.filter(
          (id) => !visible.some((selection) => selection.id === id),
        );
      }
      return Array.from(
        new Set([...current, ...visible.map((selection) => selection.id)]),
      );
    });
  }

  function changeTab(tab: SelectionTabKey) {
    setActiveTab(tab);
    setSelected([]);
  }

  if (selections.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col items-start gap-4 border-b border-gray-200 bg-white px-4 py-5 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Employee selections
          </h2>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-50 px-1.5 text-xs font-medium text-primary-700 ring-1 ring-primary-100">
            {searched.length}
          </span>
        </div>
        <div className="ml-auto flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[300px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSelected([]);
              }}
              placeholder="Search employee..."
              className="h-10 rounded-lg pl-9 text-sm font-normal shadow-none"
              data-testid="selections-input"
            />
          </div>
          <div className="inline-flex h-10 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <SelectionTabButton
              active={activeTab === "REVIEW"}
              onClick={() => changeTab("REVIEW")}
            >
              In Review · {inReview.length}
            </SelectionTabButton>
            <SelectionTabButton
              active={activeTab === "APPROVED"}
              onClick={() => changeTab("APPROVED")}
            >
              Approved · {approved.length}
            </SelectionTabButton>
          </div>
        </div>
      </div>

      {selectedVisible.length > 0 ? (
        <div className="flex flex-col gap-3 border-b border-gray-200 bg-primary-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="flex items-center gap-2 text-sm font-normal text-primary-700">
            <CheckCircle className="size-4" />
            {selectedVisible.length} selection
            {selectedVisible.length === 1 ? "" : "s"} selected
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2 text-sm font-normal text-gray-700"
              onClick={() => setSelected([])}
              data-testid="selections-button"
            >
              <X className="size-4" />
              Clear
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 gap-1.5 rounded-lg px-3 text-sm font-normal"
              onClick={() => {
                onApproveMany(selectedVisible);
                setSelected([]);
              }}
              data-testid="selections-button-2"
            >
              <CheckCircle className="size-4" />
              Approve selected
            </Button>
          </div>
        </div>
      ) : null}

      <EmployeeSelectionsTable
        selections={visible}
        selected={selected}
        allVisibleSelected={allVisibleSelected}
        onToggle={toggle}
        onToggleAll={toggleAll}
        onView={setActiveSelection}
      />
      <EmployeeSelectionDetailDrawer
        selection={activeSelection}
        onClose={() => setActiveSelection(null)}
        onApprove={onApprove}
        onRequestChanges={setRequestingChangesFor}
      />
      <RequestChangesModal
        selection={requestingChangesFor}
        open={requestingChangesFor !== null}
        onCancel={() => setRequestingChangesFor(null)}
        onSubmit={(id, notes) => {
          onRequestChanges(id, notes);
          setRequestingChangesFor(null);
          setActiveSelection(null);
        }}
      />
    </section>
  );
}
