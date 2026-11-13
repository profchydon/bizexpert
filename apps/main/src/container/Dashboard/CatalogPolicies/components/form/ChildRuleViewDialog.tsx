"use client";

import { GitBranch, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import type { CatalogRule } from "../../types";
import {
  formatRuleStatus,
  formatTrigger,
  getRuleKits,
} from "../../utilsFormat";
import { getChildRuleOverrideLabels } from "../../utilsChildRuleSummary";
import {
  PreviewChip,
  PreviewInfo,
  PreviewKitRow,
  PreviewSection,
} from "./ChildRuleViewDialogParts";

export function ChildRuleViewDialog({
  parent,
  rule,
  onClose,
}: {
  parent: CatalogRule;
  rule: CatalogRule;
  onClose: () => void;
}) {
  const kits = getRuleKits(rule);
  const overrideLabels = getChildRuleOverrideLabels(rule, parent);

  return (
    <Dialog
      open
      onOpenChange={(open) => !open && onClose()}
      data-testid="childruleviewdialog-dialog"
    >
      <DialogContent
        overlayClassName="z-[1020]"
        showCloseButton={false}
        className="z-[1021] flex max-h-[85dvh] max-w-xl flex-col gap-0 overflow-hidden rounded-xl border-gray-200 bg-white p-0"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-200 p-6 pb-5">
          <div className="flex min-w-0 flex-col gap-1">
            <DialogTitle className="truncate text-lg font-medium text-gray-900">
              {rule.name}
            </DialogTitle>
            <div className="inline-flex w-fit max-w-full items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600">
              <GitBranch className="size-3.5 shrink-0 text-primary-600" />
              <span className="truncate">Sub policy of {parent.name}</span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <PreviewChip>{formatRuleStatus(rule.status)}</PreviewChip>
            <PreviewChip>Specificity {rule.specificityScore}</PreviewChip>
            {overrideLabels.map((label) => (
              <PreviewChip key={label} active>
                {label}
              </PreviewChip>
            ))}
          </div>

          <PreviewSection title="Configuration">
            <PreviewInfo
              label="Trigger"
              value={formatTrigger(rule.triggerType)}
            />
            <PreviewInfo
              label="Allow item swap"
              value={rule.allowItemSwap ? "Yes" : "No"}
            />
          </PreviewSection>

          <PreviewSection title="Match Criteria">
            {/* <PreviewInfo
              label="Roles"
              value={formatList(rule.matchRoles, "All")}
            /> */}
            <PreviewInfo
              label="Levels"
              value={formatList(rule.matchLevels, "All")}
            />
            <PreviewInfo
              label="Departments"
              value={formatList(rule.matchDepartments, "All")}
            />
            <PreviewInfo
              label="Countries"
              value={formatList(rule.matchCountries, "Global")}
            />
          </PreviewSection>

          <PreviewSection title="Kits">
            <div className="space-y-2">
              {kits.map((kit) => (
                <PreviewKitRow key={kit.id} kit={kit} />
              ))}
              {kits.length === 0 ? (
                <p className="text-sm text-gray-500">No kit selected</p>
              ) : null}
            </div>
          </PreviewSection>

          {rule.includeCompanyStorage ? (
            <PreviewSection title="Storage">
              <PreviewInfo label="Include Storage" value="Yes" />
            </PreviewSection>
          ) : null}
        </div>

        <footer className="flex shrink-0 justify-end gap-3 border-t border-gray-200 p-6 pt-5">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-lg px-4 text-sm font-normal text-gray-700"
            onClick={onClose}
            data-testid="childruleviewdialog-button"
          >
            Close
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}

function formatList(values: string[], fallback: string) {
  return values.length ? values.join(", ") : `(${fallback})`;
}
