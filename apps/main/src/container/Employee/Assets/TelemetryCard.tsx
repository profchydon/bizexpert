"use client";

import { BadgeWithDot } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { AgentInstallSteps } from "@/container/Dashboard/AllEquipments/ViewEquipment/telemetry/ui/AgentInstallSteps";
import type { AgentTelemetry } from "@/container/Dashboard/AllEquipments/ViewEquipment/telemetry/types";
import {
  AGENT_ACTIVE_TOOLTIP,
  STALE_TOOLTIP,
} from "@/container/Dashboard/AllEquipments/ViewEquipment/telemetry/telemetryTooltips";

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-tertiary">{label}</span>
      <span className="text-sm font-medium text-primary">{value}</span>
    </div>
  );
}

export function TelemetryCard({
  telemetry,
}: {
  telemetry: AgentTelemetry | null;
}) {
  if (!telemetry) return null;

  if (!telemetry.agentInstalled) {
    return (
      <section className="flex flex-col gap-5 rounded-xl border border-secondary bg-primary p-5 shadow-xs">
        <div className="flex flex-col gap-1">
          <h2 className="text-md font-semibold text-primary">
            Set up the Rayda agent
          </h2>
          <p className="text-sm text-tertiary">
            Your company uses the Rayda agent to keep devices healthy and
            secure. Installing it takes about two minutes.
          </p>
        </div>
        <AgentInstallSteps />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-5 rounded-xl border border-secondary bg-primary p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-md font-semibold text-primary">Device health</h2>
        <Tooltip
          title={telemetry.isStale ? STALE_TOOLTIP : AGENT_ACTIVE_TOOLTIP}
          placement="top"
        >
          <TooltipTrigger className="cursor-default">
            <BadgeWithDot
              color={telemetry.isStale ? "warning" : "success"}
              size="sm"
              type="pill-color"
            >
              {telemetry.isStale ? "Agent stale" : "Agent active"}
            </BadgeWithDot>
          </TooltipTrigger>
        </Tooltip>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
        <Signal
          label="OS"
          value={`${telemetry.os.name} ${telemetry.os.version}`.trim()}
        />
        <Signal
          label="Agent version"
          value={telemetry.agentVersion || "Not collected"}
        />
        <Signal
          label="Last synced"
          value={telemetry.lastSyncedLabel || "Not collected"}
        />
      </div>
      <p className="text-sm text-tertiary">
        The agent reports health signals only. Your files and activity stay
        private.
      </p>
    </section>
  );
}
