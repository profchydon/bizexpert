"use client";

import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";
import { durationLabel } from "../complianceHistory";
import type { CheckHistory } from "../complianceHistory";
import {
  FRAMEWORKS,
  MARK_TOOLTIP,
  NOT_MAPPED_TOOLTIP,
  scoreFrameworks,
} from "../frameworkMapping";
import { CHECK_LABEL, CHECK_ORDER } from "../signalCopy";
import type { ComplianceChecks, TriState } from "../types";
import { DetailCard } from "../DetailCard";

const MARK: Record<TriState, { glyph: string; cls: string }> = {
  pass: { glyph: "✓", cls: "bg-success-50 text-success-primary" },
  fail: { glyph: "✕", cls: "bg-error-50 text-error-primary" },
  not_verified: { glyph: "?", cls: "bg-warning-50 text-warning-primary" },
};

function Mark({ state }: { state: TriState }) {
  return (
    <Tooltip title={MARK_TOOLTIP[state]} placement="top">
      <TooltipTrigger className="cursor-default">
        <span
          className={cx(
            "inline-flex size-5 items-center justify-center rounded-full text-xs font-bold",
            MARK[state].cls,
          )}
        >
          {MARK[state].glyph}
        </span>
      </TooltipTrigger>
    </Tooltip>
  );
}

// The previous version scored the device against anonymous marks: it could report three of
// five met without ever saying which three. The matrix is the honest shape of the data.
// Read a row to see where a control is required, a column to see how a framework stands.
export function FrameworkReadinessCard({
  compliance,
  history,
}: {
  compliance: ComplianceChecks;
  history: CheckHistory[];
}) {
  const scores = scoreFrameworks(compliance);
  const since = new Map(
    history.map((entry) => [entry.key, durationLabel(entry)]),
  );

  // Every framework while the section is closed, not just the weakest. They have different
  // denominators, so a single headline would hide the one the reader came to check.
  // Closed, the header carries the ratios. Open, the table two centimetres below states the
  // same three numbers, so the header hands them back and returns to its hint.
  const ratios = (
    <span className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-sm text-tertiary">
      {scores.map(({ framework, met, mapped }) => (
        <span key={framework.key} className="whitespace-nowrap">
          {framework.short}{" "}
          <span className="font-medium text-primary tabular-nums">{met}</span>
          <span className="text-quaternary tabular-nums">/{mapped}</span>
        </span>
      ))}
    </span>
  );

  return (
    <DetailCard
      title="Framework readiness"
      collapsible
      defaultOpen={false}
      action={(open) =>
        open ? (
          <span className="text-sm text-tertiary">
            Evidence exports automatically
          </span>
        ) : (
          ratios
        )
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[460px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="pb-3 text-left" />
              {scores.map(({ framework, met, mapped }) => (
                <th
                  key={framework.key}
                  className="px-2.5 pb-3 text-center align-bottom text-sm font-medium text-tertiary"
                >
                  {framework.name}
                  <span className="mt-0.5 block text-md font-semibold text-primary tabular-nums">
                    {met}{" "}
                    <span className="text-xs font-normal text-quaternary">
                      of {mapped}
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CHECK_ORDER.map((key) => (
              <tr key={key}>
                <td className="border-t border-secondary py-2.5 pr-3 font-medium whitespace-nowrap text-primary">
                  {CHECK_LABEL[key]}
                  {since.get(key) && (
                    <span className="ml-2 text-xs font-normal text-error-primary tabular-nums">
                      {since.get(key)}
                    </span>
                  )}
                </td>
                {FRAMEWORKS.map((framework) => (
                  <td
                    key={framework.key}
                    className="border-t border-secondary px-2.5 py-2.5 text-center"
                  >
                    {framework.covers.includes(key) ? (
                      <Mark state={compliance[key]} />
                    ) : (
                      <Tooltip title={NOT_MAPPED_TOOLTIP} placement="top">
                        <TooltipTrigger className="cursor-default text-quaternary">
                          —
                        </TooltipTrigger>
                      </Tooltip>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2 border-t border-secondary pt-3.5 text-xs text-tertiary">
        <span className="flex items-center gap-1.5">
          <Mark state="pass" />
          Met
        </span>
        <span className="flex items-center gap-1.5">
          <Mark state="fail" />
          Failing
        </span>
        <span className="flex items-center gap-1.5">
          <Mark state="not_verified" />
          Unverified
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-quaternary">—</span>
          Not mapped by this framework
        </span>
      </div>
    </DetailCard>
  );
}
