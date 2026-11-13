"use client";

import { Button } from "@/components/base/buttons/button";
import { useUpdateTelemetryIssueMutation } from "@/api/baseQueries/companiesApi/telemetryApi";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import type { AssignedContact } from "../assignedContact";
import type { CheckHistory } from "../complianceHistory";
import type { HardwareIssue, HealthIssue } from "../deviceHealth";
import { combinedMailto } from "../reminderEmail";
import { getReminderSchedule } from "../reminders";
import { CHECK_ORDER } from "../signalCopy";
import { DetailCard } from "../DetailCard";
import { recordEscalation, useDeviceIssueActions } from "../telemetryActions";
import { ComplianceIssueRow } from "./ComplianceIssueRow";
import { HardwareIssueRow } from "./HardwareIssueRow";

interface Props {
  deviceId: string;
  issues: HealthIssue[];
  hardwareIssues: HardwareIssue[];
  holder: string;
  history: CheckHistory[];
  contact: AssignedContact | null;
  deviceName: string;
  onToast: (message: string) => void;
}

// Everything the verdict named, in one place. A passing check costs one pill in the strip
// below; anything wrong costs a whole row here, so severity has visual weight.
//
// The escalation lives at the card, not on each row. Per row it produced two identical
// buttons for the same person on the same device, so whichever draft went second arrived as
// a duplicate to someone who had already ignored ten reminders. A person writing to a
// colleague writes once, about everything, and that is the message likeliest to work.
export function NeedsAttentionCard({
  deviceId,
  issues,
  hardwareIssues,
  holder,
  history,
  contact,
  deviceName,
  onToast,
}: Props) {
  const first = holder.split(" ")[0] || "the assignee";
  const actionFor = useDeviceIssueActions(deviceId);
  const companyId = useWorkspaceCompanyId() as string;
  const [updateIssue] = useUpdateTelemetryIssueMutation();
  const openDays = new Map(
    history.map((entry) => [entry.key, entry.changedDaysAgo]),
  );

  const rows = issues.map((issue) => {
    const open = openDays.get(issue.key) ?? null;
    return {
      issue,
      open,
      schedule: getReminderSchedule(deviceId, issue.key, issue.tone, open),
    };
  });
  // A paused loop is no longer failing to reach anyone, so it stops counting toward the
  // banner. Pause the last one and the banner goes with it.
  const escalated = rows.filter(
    (r) => r.schedule.escalated && !actionFor(r.issue.key).pausedOn,
  );
  // Nothing the team has already dismissed belongs in a message to the holder.
  const liveHardware = hardwareIssues.filter(
    (h) => !actionFor(h.key).ignoredOn,
  );
  const totalSent = escalated.reduce((n, r) => n + r.schedule.sentCount, 0);
  const total = issues.length + hardwareIssues.length;

  return (
    <DetailCard
      title="Needs attention"
      action={
        <span className="text-sm text-tertiary">
          {total} {total === 1 ? "issue" : "issues"} · {issues.length} of{" "}
          {CHECK_ORDER.length} checks
        </span>
      }
    >
      {escalated.length > 0 && (
        <div className="-mx-5 -mt-4 mb-4 border-b border-error-300 bg-error-primary px-5 py-3.5">
          <p className="text-sm text-error-primary">
            <span className="font-semibold">
              Reminders are not reaching {first}.
            </span>{" "}
            {totalSent} sent across{" "}
            {escalated.length === 1
              ? "this check"
              : `these ${escalated.length} checks`}
            , none answered.
          </p>
          {/* Sent from the admin's address, not Rayda's, because Rayda's own reminders are
              the thing that has stopped working. Saying so is what keeps this from looking
              like an inconsistency with the install request, which Rayda does send. */}
          <p className="mt-1 text-xs text-tertiary">
            This opens a draft from your address rather than sending another
            automated nudge, because the automated ones are what have not
            worked.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {contact && (
              <Button
                size="sm"
                color="primary-destructive"
                href={combinedMailto(
                  contact,
                  deviceName,
                  escalated,
                  liveHardware,
                )}
                onClick={() =>
                  escalated.forEach((r) =>
                    recordEscalation(deviceId, r.issue.key),
                  )
                }
                data-testid="needsattentioncard-button"
              >
                Email {first} about this device
              </Button>
            )}
            <Button
              size="sm"
              color="secondary"
              onClick={() => {
                escalated.forEach((row) => {
                  void updateIssue({
                    companyId,
                    deviceId,
                    issue: row.issue.key,
                    paused: true,
                  });
                });
                onToast(
                  `Reminders paused. ${first} will not be nudged about this device.`,
                );
              }}
              data-testid="needsattentioncard-button-2"
            >
              Pause all reminders
            </Button>
          </div>
        </div>
      )}

      <ul className="flex flex-col divide-y divide-border-secondary">
        {rows.map(({ issue, schedule, open }) => (
          <ComplianceIssueRow
            key={issue.key}
            deviceId={deviceId}
            issue={issue}
            schedule={schedule}
            openDays={open}
            first={first}
            onToast={onToast}
          />
        ))}
        {hardwareIssues.map((issue) => (
          <HardwareIssueRow
            key={issue.key}
            deviceId={deviceId}
            issue={issue}
            contact={contact}
            deviceName={deviceName}
            first={first}
          />
        ))}
      </ul>

      <p className="mt-3.5 border-t border-secondary pt-3 text-sm text-tertiary">
        Rayda reminds {first} on a schedule while a check stays open. It is a
        monitoring agent, not device management software, so nothing here
        changes a setting on the device remotely.
      </p>
    </DetailCard>
  );
}
