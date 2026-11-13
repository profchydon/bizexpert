"use client";

import { Lock01 } from "@untitledui/icons";
import { Banner } from "@/components/application/alerts/banner";
import { Button } from "@/components/base/buttons/button";
import { getAgentLog } from "../agentLog";
import { resolveAssignedContact } from "../assignedContact";
import { getComplianceHistory } from "../complianceHistory";
import { uninstallMailto } from "../reminderEmail";
import type { AgentTelemetry } from "../types";
import type { Revocation } from "../telemetryRevocations";
import { revokedDays } from "../telemetryRevocations";
import { useRestoreTelemetryCollectingMutation } from "@/api/baseQueries/companiesApi/telemetryApi";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import type { EquipmentDetail } from "../equipmentHost";
import { AgentLogCard } from "./AgentLogCard";
import { ComplianceCard } from "./ComplianceCard";
import { CurrentReadingsCard } from "./CurrentReadingsCard";
import { SyncStatusBar } from "./SyncStatusBar";

interface Props {
  device: EquipmentDetail;
  telemetry: AgentTelemetry;
  revocation: Revocation;
  onToast: (message: string) => void;
}

/**
 * Rayda has stopped collecting from this device.
 *
 * Deliberately not AgentSetupState. That screen reads "Nothing is reporting from this device", urges
 * an install request and offers an MDM push, and its badge says the agent is not there "yet". Every
 * one of those is the wrong tense for a decision the admin took on purpose.
 *
 * The second line is the honest part. Rayda cannot uninstall the agent, so revoking stops us
 * accepting its check-ins and nothing more. Saying the agent was removed would be the same class of
 * claim as the MDM card that promised a push it could not make.
 */
export function RevokedState({
  device,
  telemetry,
  revocation,
  onToast,
}: Props) {
  const contact = resolveAssignedContact(device);
  const first = device.assignee.split(" ")[0] || "the assignee";
  const gapDays = revokedDays(revocation);
  const history = getComplianceHistory(device.id, telemetry, gapDays);
  const log = getAgentLog(device.id, telemetry, history);
  const companyId = useWorkspaceCompanyId() as string;
  const [restore, restoreState] = useRestoreTelemetryCollectingMutation();

  return (
    <div className="flex flex-col gap-6">
      <Banner
        tone="warning"
        icon={Lock01}
        title="Not collecting from this device"
        description={`${revocation.revokedBy} stopped collecting on ${revocation.revokedOn}. The readings below are the last ones received.`}
        meta={`The agent may still be installed until ${first} removes it. Rayda is no longer accepting anything it sends.`}
        action={
          <div className="flex flex-wrap gap-2">
            {contact && (
              <Button
                size="sm"
                color="secondary"
                href={uninstallMailto(contact, device.name)}
                data-testid="revokedstate-button"
              >
                Email {first}
              </Button>
            )}
            <Button
              size="sm"
              color="primary"
              isLoading={restoreState.isLoading}
              onClick={() => {
                void restore({ companyId, deviceId: device.id })
                  .unwrap()
                  .then(() => onToast(`Collecting again from ${device.name}.`));
              }}
              data-testid="revokedstate-button-2"
            >
              Restore
            </Button>
          </div>
        }
      />

      <SyncStatusBar telemetry={telemetry} revokedOn={revocation.revokedOn} />
      <CurrentReadingsCard
        telemetry={telemetry}
        frozenOn={revocation.revokedOn}
      />
      <ComplianceCard history={history} />
      <AgentLogCard events={log} defaultOpen={false} />
    </div>
  );
}
