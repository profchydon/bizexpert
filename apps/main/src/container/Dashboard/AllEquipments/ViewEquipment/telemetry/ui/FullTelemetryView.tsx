"use client";

import { getAgentLog } from "../agentLog";
import { resolveAssignedContact } from "../assignedContact";
import { getComplianceHistory } from "../complianceHistory";
import { getDeviceHealth } from "../deviceHealth";
import type { AgentTelemetry } from "../types";
import type { EquipmentDetail } from "../equipmentHost";
import { AgentLogCard } from "./AgentLogCard";
import { AgentOutdatedBanner } from "./AgentOutdatedBanner";
import { AppInventoryCard } from "./AppInventoryCard";
import { CollectingHistoryPanel } from "./CollectingHistoryPanel";
import { ComplianceCard } from "./ComplianceCard";
import { CurrentReadingsCard } from "./CurrentReadingsCard";
import { FrameworkReadinessCard } from "./FrameworkReadinessCard";
import { MemoryConsumersCard } from "./MemoryConsumersCard";
import { NeedsAttentionCard } from "./NeedsAttentionCard";
import { SyncStatusBar } from "./SyncStatusBar";
import { UpdateRestartCard } from "./UpdateRestartCard";
import { VerdictBand } from "./VerdictBand";
import { WithheldPanel } from "./WithheldPanel";

interface Props {
  device: EquipmentDetail;
  telemetry: AgentTelemetry;
  onToast: (message: string) => void;
}

// Verdict first, then evidence, then history. The band answers "is this device fine"
// before any scrolling; the compliance track and the log answer "since when".
export function FullTelemetryView({ device, telemetry, onToast }: Props) {
  const deviceId = device.id;
  const holder = device.assignee;
  // Null for a device held by an office area rather than a person, which is what decides
  // whether there is anyone to escalate to.
  const contact = resolveAssignedContact(device);
  const health = getDeviceHealth(telemetry);
  const history = getComplianceHistory(deviceId, telemetry);
  const log = getAgentLog(deviceId, telemetry, history);
  // Cycle count and per app memory arrived with the current agent. On an older build the
  // sections stay empty, and saying so beats letting a blank read as a clean result.
  const stale = !telemetry.agentUpToDate;
  // Good news should be cheap to read. With nothing wrong, compliance and the activity log
  // are confirmation rather than diagnosis, so a clean device is its verdict and readings.
  const clean =
    health.issues.length === 0 && health.hardwareIssues.length === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* {stale && (
        <AgentOutdatedBanner
          version={telemetry.agentVersion}
          canUseMdm
          onToast={onToast}
        />
      )} */}
      <SyncStatusBar telemetry={telemetry} />
      <CollectingHistoryPanel history={telemetry.history} />
      <VerdictBand telemetry={telemetry} health={health} />
      {!clean && (
        <NeedsAttentionCard
          deviceId={deviceId}
          issues={health.issues}
          hardwareIssues={health.hardwareIssues}
          holder={holder}
          history={history}
          contact={contact}
          deviceName={device.name}
          onToast={onToast}
        />
      )}
      <UpdateRestartCard telemetry={telemetry} />
      {stale ? (
        <WithheldPanel
          title="Current readings"
          hint="Needs agent 2.4.1"
          heading="Cycle count is not reported by this agent"
          reason="This build reports charge level only. Cycle count, rated life and maximum capacity arrived in the current version."
        />
      ) : (
        <CurrentReadingsCard telemetry={telemetry} />
      )}
      <ComplianceCard history={history} />
      <FrameworkReadinessCard
        compliance={telemetry.compliance}
        history={history}
      />
      {stale ? (
        <WithheldPanel
          title="Top memory consumers"
          hint="Needs agent 2.4.1"
          heading="Per app memory is not reported by this agent"
          reason="This build does not sample running processes. Update the agent to see which applications hold memory."
        />
      ) : (
        <MemoryConsumersCard telemetry={telemetry} />
      )}
      <AppInventoryCard software={telemetry.software} />
      <AgentLogCard events={log} defaultOpen={!clean} />
    </div>
  );
}
