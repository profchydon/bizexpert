"use client";

import { CheckCircle, Send01, UserPlus01 } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { useSendTelemetryInstallRequestMutation } from "@/api/baseQueries/companiesApi/telemetryApi";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import type { AssignedContact } from "../assignedContact";
import { DetailCard } from "../DetailCard";
import { useInstallRequest } from "../installRequests";

// The admin is rarely holding the device: it is with an employee, often in another
// country. So the first move is asking them to install it, not downloading anything.
export function RequestInstallCard({
  deviceId,
  deviceName,
  contact,
  personal = false,
  onToast,
}: {
  deviceId: string;
  deviceName: string;
  contact: AssignedContact | null;
  personal?: boolean;
  onToast: (message: string) => void;
}) {
  const sentAt = useInstallRequest(deviceId);
  const companyId = useWorkspaceCompanyId() as string;
  const [sendRequest, sendState] = useSendTelemetryInstallRequestMutation();

  async function send(resend: boolean) {
    await sendRequest({ companyId, deviceId }).unwrap();
    onToast(
      resend
        ? `Reminder sent to ${contact?.name}`
        : `Install request sent to ${contact?.name}`,
    );
  }

  return (
    <DetailCard title="Install the Rayda agent">
      <div className="flex flex-col gap-5">
        <p className="text-sm text-tertiary">
          The agent has not reported from {deviceName} yet.{" "}
          {contact
            ? `${contact.name} has this device, so the quickest way is to ask them to install it. It takes about two minutes.`
            : "Nobody is assigned to it, so there is no one to ask. Assign it to someone, or use one of the paths below."}
        </p>

        {contact ? (
          <div className="flex flex-col gap-3 rounded-xl border border-secondary bg-secondary p-4 sm:flex-row sm:items-center">
            <Avatar size="md" initials={contact.initials} alt={contact.name} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-primary">
                {contact.name}
              </p>
              <p className="truncate text-sm text-tertiary">{contact.email}</p>
            </div>
            {sentAt ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm text-success-primary">
                  <CheckCircle className="size-4" />
                  Requested {sentAt}
                </span>
                <Button
                  size="sm"
                  color="secondary"
                  isLoading={sendState.isLoading}
                  onClick={() => send(true)}
                  data-testid="requestinstallcard-button"
                >
                  Send a reminder
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                color="primary"
                iconLeading={Send01}
                isLoading={sendState.isLoading}
                onClick={() => send(false)}
                data-testid="requestinstallcard-button-2"
              >
                Send install request
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-xl border border-secondary bg-secondary p-4">
            <UserPlus01 className="mt-0.5 size-4 shrink-0 text-fg-quaternary" />
            <p className="text-sm text-tertiary">
              Assign this device to an employee from the Actions menu, then ask
              them to install the agent.
            </p>
          </div>
        )}

        <p className="text-sm text-tertiary">
          {sentAt
            ? "They get a link for their operating system and three short steps. This tab fills in about 10 minutes after their first sync."
            : personal
              ? "They get an email with a link for their operating system, three short steps, and the summary above of what is and is not collected on a personal device. Nothing else is needed from you."
              : "They get an email with a link for their operating system and three short steps. Nothing else is needed from you."}
        </p>
      </div>
    </DetailCard>
  );
}
