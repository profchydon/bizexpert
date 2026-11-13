"use client";

import { ClockRefresh } from "@untitledui/icons";
import { Banner } from "@/components/application/alerts/banner";
import { Button } from "@/components/base/buttons/button";
import { LATEST_AGENT_VERSION } from "../agentTelemetry";

// An old agent reports successfully, so the sections it cannot fill look like clean
// results. Naming the version and listing exactly what is missing turns a silent gap into
// a stated one.
export function AgentOutdatedBanner({
  version,
  canUseMdm,
  onToast,
}: {
  version: string;
  canUseMdm: boolean;
  onToast: (message: string) => void;
}) {
  return (
    <Banner
      tone="warning"
      icon={ClockRefresh}
      title={`This device is on agent ${version}. The current build is ${LATEST_AGENT_VERSION}`}
      description={`It is checking in, so compliance, patch state and storage below are current. Battery cycle count, running applications and per app memory arrived in ${LATEST_AGENT_VERSION} and stay empty until it updates.`}
      action={
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() =>
              onToast(
                "Update reminder sent. The agent updates on its next check-in.",
              )
            }
            data-testid="agentoutdatedbanner-button"
          >
            Send update reminder
          </Button>
          {canUseMdm && (
            <Button
              size="sm"
              color="secondary"
              onClick={() =>
                onToast(
                  "Package details copied. Push it from your MDM console.",
                )
              }
              data-testid="agentoutdatedbanner-button-2"
            >
              Push through your MDM
            </Button>
          )}
        </div>
      }
    />
  );
}
