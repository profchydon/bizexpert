"use client";

import Drawer from "react-modern-drawer";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import type { RuleRunEntry } from "../../types";
import {
  formatRunDetailTime,
  formatRunTrigger,
  getRunDetailNotes,
  getRunOutcomeExplanation,
} from "../../utilsRunDetail";
import { formatRunOutcome } from "../../utilsRunHistory";
import { ResizableDrawerHandle } from "../overlays/ResizableDrawerHandle";
import { useResizableDrawer } from "../form/useResizableDrawer";

const MIN_WIDTH = 380;
const MAX_WIDTH = 580;
const DEFAULT_WIDTH = 460;
const OUTCOME_STYLES: Record<RuleRunEntry["outcome"], string> = {
  MATCHED: "border-success-200 bg-success-50 text-success-700",
  RESOLVED: "border-success-200 bg-success-50 text-success-700",
  SUPERSEDED: "border-warning-200 bg-warning-50 text-warning-700",
  FAILED: "border-error-200 bg-error-50 text-error-700",
  POLICY_UNMATCHED: "border-error-200 bg-error-50 text-error-700",
};

export function RunDetailDrawer({
  entry,
  onClose,
}: {
  entry: RuleRunEntry | null;
  onClose: () => void;
}) {
  const { width, isResizing, startResize } = useResizableDrawer({
    minWidth: MIN_WIDTH,
    maxWidth: MAX_WIDTH,
    defaultWidth: DEFAULT_WIDTH,
  });

  return (
    <Drawer
      open={entry !== null}
      onClose={onClose}
      direction="right"
      enableOverlay
      lockBackgroundScroll
      duration={isResizing ? 0 : 200}
      size={width}
      zIndex={1014}
      overlayOpacity={0.35}
      overlayColor="#344054"
      className="border-l border-gray-200 bg-white shadow-2xl"
    >
      {entry ? (
        <div className="relative flex h-full flex-col bg-white">
          <ResizableDrawerHandle
            resizing={isResizing}
            onPointerDown={startResize}
          />
          <header className="flex items-start justify-between gap-4 px-6 pb-5 pt-6">
            <div className="flex min-w-0 flex-col gap-1 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-lg font-semibold text-gray-900">
                  {entry.employeeName}
                </h2>
                <OutcomeBadge entry={entry} />
              </div>
              <p className="text-sm font-normal text-gray-500">
                {formatRunDetailTime(entry.triggeredAt)}
              </p>
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

          <div className="mx-6 h-px bg-gray-200" />

          <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
            <section className="flex flex-wrap items-center gap-2">
              <InfoPill>{entry.employeeRole}</InfoPill>
              <InfoPill>{entry.employeeCountry}</InfoPill>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Why this outcome
              </h3>
              <p className="text-sm font-normal leading-5 text-gray-600">
                {getRunOutcomeExplanation(entry)}
              </p>
            </section>

            <SectionDivider />

            <section className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Run details
              </h3>
              <dl className="flex flex-col gap-2 text-sm">
                <DetailRow label="Trigger" value={formatRunTrigger(entry)} />
                <DetailRow
                  label="Superseded by"
                  value={entry.supersededBy ?? "—"}
                />
                {/* Onboarding record is hidden until the detail design needs it again. */}
                {/* <DetailRow
                  label="Onboarding record"
                  value={entry.onboardingRecordId ?? "—"}
                /> */}
              </dl>
            </section>

            <SectionDivider />

            <section className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-900">Notes</h3>
              <p className="text-sm font-normal leading-5 text-gray-600">
                {getRunDetailNotes(entry)}
              </p>
            </section>
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}

function InfoPill({ children }: { children: string }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 text-sm font-medium text-gray-700">
      {children}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-gray-500">{label}</dt>
      <dd className="min-w-0 truncate text-right text-gray-700" title={value}>
        {value}
      </dd>
    </div>
  );
}

function SectionDivider() {
  return <div className="h-px w-full bg-gray-200" />;
}

function OutcomeBadge({ entry }: { entry: RuleRunEntry }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full border px-2.5 text-sm font-medium",
        OUTCOME_STYLES[entry.outcome],
      )}
    >
      {formatRunOutcome(entry.outcome)}
    </span>
  );
}
