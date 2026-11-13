"use client";

import { getAgentLog } from "../agentLog";
import { getComplianceHistory } from "../complianceHistory";
import { getDeviceHealth } from "../deviceHealth";
import type { AgentTelemetry } from "../types";
import { AgentLogCard } from "./AgentLogCard";
import { CollectingHistoryPanel } from "./CollectingHistoryPanel";
import { ComplianceCard } from "./ComplianceCard";
import { CurrentReadingsCard } from "./CurrentReadingsCard";
import { FrameworkReadinessCard } from "./FrameworkReadinessCard";
import { NotCollectedCard } from "./NotCollectedCard";
import { StaleSyncBanner } from "./StaleSyncBanner";
import { SyncStatusBar } from "./SyncStatusBar";
import { UpdateRestartCard } from "./UpdateRestartCard";
import { VerdictBand } from "./VerdictBand";

interface Props {
  deviceId: string;
  telemetry: AgentTelemetry;
}

// Reduced scope, not reduced compliance. A personal device that reaches company data still
// has to be encrypted, so the security posture is collected in full. What stops at the
// boundary is the personal inventory, and every withheld panel says why.
export function EmployeeTelemetryView({ deviceId, telemetry }: Props) {
  const history = getComplianceHistory(deviceId, telemetry);
  // Scored over compliance alone. Battery and storage penalties would be scoring hardware
  // that is not ours and not visible.
  const health = getDeviceHealth(telemetry, true);
  // Compliance scoped. The track above already dates these events, so withholding the log
  // that says the same thing would be an inconsistency, not a privacy boundary. Storage
  // and battery events are excluded, because that hardware is not collected here.
  const log = getAgentLog(deviceId, telemetry, history, 3, true);

  return (
    <div className="flex flex-col gap-6">
      {telemetry.isStale && (
        <StaleSyncBanner daysSinceSync={telemetry.daysSinceSync} />
      )}
      <SyncStatusBar telemetry={telemetry} />
      <CollectingHistoryPanel history={telemetry.history} />
      <VerdictBand telemetry={telemetry} health={health} reduced />
      <ComplianceCard history={history} />
      <UpdateRestartCard telemetry={telemetry} />
      <CurrentReadingsCard telemetry={telemetry} reduced />
      <NotCollectedCard />
      <FrameworkReadinessCard
        compliance={telemetry.compliance}
        history={history}
      />
      <AgentLogCard events={log} />
    </div>
  );
}
