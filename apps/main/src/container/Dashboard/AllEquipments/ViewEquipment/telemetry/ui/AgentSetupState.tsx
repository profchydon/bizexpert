"use client";

import { AlertTriangle } from "@untitledui/icons";
import { Banner } from "@/components/application/alerts/banner";
import { LATEST_AGENT_VERSION } from "../agentTelemetry";
import { resolveAssignedContact } from "../assignedContact";
import { resolveOwnership } from "../ownership";
import type { AgentTelemetry } from "../types";
import { DetailCard } from "../DetailCard";
import type { EquipmentDetail } from "../equipmentHost";
import { AgentInstallSteps } from "./AgentInstallSteps";
import { MdmDeploymentCard } from "./MdmDeploymentCard";
import { PersonalScopeNote } from "./PersonalScopeNote";
import { ReadingsPreview } from "./ReadingsPreview";
import { RequestInstallCard } from "./RequestInstallCard";

interface Props {
  device: EquipmentDetail;
  telemetry: AgentTelemetry;
  onToast: (message: string) => void;
}

// Leads with the question rather than three install methods, and names the version. An
// older build connects and looks like success while reporting half the data, so "install
// the current one" is the instruction that matters.
export function AgentSetupState({ device, telemetry, onToast }: Props) {
  const contact = resolveAssignedContact(device);
  // MDM enrolls company hardware. Pushing software to someone's own device is not ours to do.
  const employeeOwned = resolveOwnership(device) === "employee";
  const canUseMdm = !employeeOwned;

  return (
    <div className="flex flex-col gap-6">
      <Banner
        tone="warning"
        icon={AlertTriangle}
        title="Nothing is reporting from this device"
        description={`Is the Rayda agent running on it? If not, install version ${LATEST_AGENT_VERSION}, the current build, and this tab fills in at the first check-in. An older build will connect but will not report battery cycles, running applications or per app memory.`}
      />

      {/* No sync bar here: it only restated the banner above it. The two install paths come
          before the sample, so the thing to do is not below the fold. */}
      {employeeOwned && <PersonalScopeNote />}
      <RequestInstallCard
        deviceId={device.id}
        deviceName={device.name}
        contact={contact}
        personal={employeeOwned}
        onToast={onToast}
      />
      {canUseMdm && <MdmDeploymentCard />}
      <DetailCard
        title="Install it yourself"
        collapsible
        defaultOpen={false}
        action={
          <span className="text-sm text-tertiary">
            If the device is with you
          </span>
        }
      >
        <AgentInstallSteps />
      </DetailCard>
      <ReadingsPreview />
    </div>
  );
}
