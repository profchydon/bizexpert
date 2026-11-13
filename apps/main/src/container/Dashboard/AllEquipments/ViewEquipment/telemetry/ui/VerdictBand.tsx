"use client";

import { Badge } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";
import type { DeviceHealth, HealthTone } from "../deviceHealth";
import { dayCount } from "../historyWindow";
import { STALE_TOOLTIP } from "../telemetryTooltips";
import type { AgentTelemetry } from "../types";
import { HealthRing } from "./HealthRing";
import { VitalCell } from "./VitalCell";

// Tinting the band by verdict means the tab's tone is set before a single word is read.
const TONE_SHELL: Record<HealthTone, string> = {
  healthy: "border-success-300 bg-success-25",
  minor: "border-warning-300 bg-warning-25",
  attention: "border-error-300 bg-error-25",
};
const TONE_DIVIDER: Record<HealthTone, string> = {
  healthy: "divide-success-200 border-success-200",
  minor: "divide-warning-200 border-warning-200",
  attention: "divide-error-200 border-error-200",
};

// `reduced` is the personal device band. It swaps the hardware vitals for compliance ones,
// because battery and disk are not collected there and showing them would contradict the
// withheld panels further down the tab.
export function VerdictBand({
  telemetry,
  health,
  reduced = false,
}: {
  telemetry: AgentTelemetry;
  health: DeviceHealth;
  reduced?: boolean;
}) {
  const storagePercent =
    (telemetry.storage.freeGb / telemetry.storage.totalGb) * 100;
  const { battery } = telemetry;
  const checks = health.passingCount + health.issues.length;
  const osNote =
    telemetry.patch.pendingUpdates === 0
      ? "Up to date"
      : `${telemetry.patch.pendingUpdates} update${telemetry.patch.pendingUpdates === 1 ? "" : "s"} pending`;

  return (
    <section
      className={cx(
        "overflow-hidden rounded-xl border shadow-xs",
        TONE_SHELL[health.tone],
      )}
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5">
        <HealthRing score={health.score} tone={health.tone} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-md font-semibold text-primary">
              {health.headline}
            </h2>
            {telemetry.isStale && (
              <Tooltip title={STALE_TOOLTIP} placement="top">
                <TooltipTrigger className="cursor-default">
                  <Badge color="warning" size="sm">
                    Stale data
                  </Badge>
                </TooltipTrigger>
              </Tooltip>
            )}
          </div>
          <p className="mt-0.5 text-sm text-tertiary">{health.summary}</p>
        </div>
      </div>
      <div
        className={cx(
          "grid grid-cols-2 divide-x divide-y border-t lg:grid-cols-4 lg:divide-y-0",
          TONE_DIVIDER[health.tone],
        )}
      >
        {reduced ? (
          <VitalCell
            label="Checks passing"
            value={`${health.passingCount} of ${checks}`}
            alert={health.issues.length > 0}
            meterPercent={(health.passingCount / Math.max(1, checks)) * 100}
          />
        ) : (
          /* Capacity and cycles, not charge level. Charge is a moment in time and says
             nothing about whether the cell needs replacing. */
          <VitalCell
            label="Battery capacity"
            value={`${battery.maxCapacityPct}%`}
            alert={health.batteryWorn}
            meterPercent={battery.maxCapacityPct}
            note={`${battery.cycleCount.toLocaleString()} of ${battery.ratedCycles.toLocaleString()} cycles`}
          />
        )}
        {reduced ? (
          <VitalCell
            label="Operating system"
            value={`${telemetry.os.name} ${telemetry.os.version.split(" ")[0]}`}
            note={osNote}
          />
        ) : (
          <VitalCell
            label="Storage free"
            value={`${telemetry.storage.freeGb} GB`}
            alert={health.lowStorage}
            meterPercent={storagePercent}
            note={`of ${telemetry.storage.totalGb} GB`}
          />
        )}
        {reduced ? (
          <VitalCell
            label="Last restart"
            value={
              telemetry.patch.lastRebootDays === 0
                ? "Today"
                : dayCount(telemetry.patch.lastRebootDays)
            }
            note={`Fleet median ${dayCount(telemetry.update.fleetMedianRestartDays)}`}
          />
        ) : (
          <VitalCell
            label="Operating system"
            value={`${telemetry.os.name} ${telemetry.os.version.split(" ")[0]}`}
            note={osNote}
          />
        )}
        {reduced ? (
          <VitalCell
            label="Memory pressure"
            value={`${telemetry.memory.pressureAvgPct}%`}
            meterPercent={telemetry.memory.pressureAvgPct}
            note="Average, aggregate only"
          />
        ) : (
          <VitalCell
            label="Last restart"
            value={
              telemetry.patch.lastRebootDays === 0
                ? "Today"
                : dayCount(telemetry.patch.lastRebootDays)
            }
            note={`Fleet median ${dayCount(telemetry.update.fleetMedianRestartDays)}`}
          />
        )}
      </div>
    </section>
  );
}
