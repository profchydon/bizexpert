"use client";

import { AlertTriangle, Clock } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";
import type { HealthIssue } from "../deviceHealth";
import type { ReminderSchedule } from "../reminders";
import { openedLabel } from "../reminders";
import { markHandled, useIssueAction } from "../telemetryActions";
import { useUpdateTelemetryIssueMutation } from "@/api/baseQueries/companiesApi/telemetryApi";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { ReminderTimeline } from "./ReminderTimeline";

interface Props {
  deviceId: string;
  issue: HealthIssue;
  schedule: ReminderSchedule;
  openDays: number | null;
  first: string;
  onToast: (message: string) => void;
}

// An escalated row is marked with a spine rather than a fill. A tinted ground only reads as
// an exception while some rows lack it, and on the device this state was built for every
// open check has escalated, which turned the card into one pink block.
export function ComplianceIssueRow({
  deviceId,
  issue,
  schedule,
  openDays,
  first,
  onToast,
}: Props) {
  const state = useIssueAction(deviceId, issue.key);
  const companyId = useWorkspaceCompanyId() as string;
  const [updateIssue] = useUpdateTelemetryIssueMutation();
  const failing = issue.tone === "fail";
  const Icon = failing ? AlertTriangle : Clock;
  const paused = Boolean(state.pausedOn);

  return (
    <li
      className={cx(
        "py-3.5 first:pt-0 last:pb-0",
        schedule.escalated && !paused && "border-l-2 border-l-error-500 pl-3.5",
      )}
    >
      <div className="flex gap-3.5">
        <span
          className={cx(
            "flex size-8 shrink-0 items-center justify-center rounded-lg",
            failing
              ? "bg-error-50 text-fg-error-primary"
              : "bg-warning-50 text-fg-warning-primary",
          )}
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-primary">
            {issue.title}
            {paused && (
              <Tooltip
                title="Rayda has stopped nudging the holder. The check is still open and still counts against this device."
                placement="top"
              >
                <TooltipTrigger className="cursor-default">
                  <Badge color="gray" size="sm">
                    Reminders paused
                  </Badge>
                </TooltipTrigger>
              </Tooltip>
            )}
            {state.handledOn && (
              <Tooltip
                title={`Someone on your team took this on, on ${state.handledOn}.`}
                placement="top"
              >
                <TooltipTrigger className="cursor-default">
                  <Badge color="success" size="sm">
                    Handled
                  </Badge>
                </TooltipTrigger>
              </Tooltip>
            )}
          </p>
          <p className="text-sm text-tertiary">
            {schedule.escalated && !paused
              ? `${schedule.sentCount} reminders over ${schedule.openDays} days, no change.`
              : issue.detail}
          </p>

          <ReminderTimeline
            schedule={schedule}
            opened={openedLabel(issue.tone, openDays)}
            failing={failing}
            paused={paused}
            pausedOn={state.pausedOn}
          />

          {/* The click is the record. A mailto hands off to a mail client, so the page cannot
              know the message was sent, and it says so rather than implying a receipt. */}
          {state.emailedOn && !state.handledOn && (
            <div className="mt-2.5 rounded-lg border border-secondary bg-secondary px-3 py-2 text-xs text-tertiary">
              You opened a draft to {first} on {state.emailedOn}. Rayda cannot
              confirm it was sent, so this is a note to your team, not a
              delivery receipt.
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {state.emailedOn && !state.handledOn && (
              <Button
                size="sm"
                color="secondary"
                onClick={() => markHandled(deviceId, issue.key)}
                data-testid="complianceissuerow-button"
              >
                Mark as handled
              </Button>
            )}
            {paused ? (
              <Button
                size="sm"
                color="secondary"
                onClick={() => {
                  void updateIssue({
                    companyId,
                    deviceId,
                    issue: issue.key,
                    paused: false,
                  });
                  onToast(
                    `Reminders resumed. ${first} will be nudged again about this.`,
                  );
                }}
                data-testid="complianceissuerow-button-2"
              >
                Resume reminders
              </Button>
            ) : (
              schedule.escalated && (
                <Button
                  size="sm"
                  color="secondary"
                  onClick={() => {
                    void updateIssue({
                      companyId,
                      deviceId,
                      issue: issue.key,
                      paused: true,
                    });
                    onToast(
                      `Reminders paused. ${first} will not be nudged again about this.`,
                    );
                  }}
                  data-testid="complianceissuerow-button-3"
                >
                  Pause reminders
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
