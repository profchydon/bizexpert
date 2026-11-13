"use client";

import { BatteryLow, HardDrive } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { useUpdateTelemetryIssueMutation } from "@/api/baseQueries/companiesApi/telemetryApi";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import routes from "@/routes";
import { cx } from "@/utils/cx";
import type { AssignedContact } from "../assignedContact";
import type { HardwareIssue } from "../deviceHealth";
import { hardwareMailto } from "../reminderEmail";
import { useIssueAction } from "../telemetryActions";

interface Props {
  deviceId: string;
  issue: HardwareIssue;
  contact: AssignedContact | null;
  deviceName: string;
  first: string;
}

export function HardwareIssueRow({
  deviceId,
  issue,
  contact,
  deviceName,
  first,
}: Props) {
  const state = useIssueAction(deviceId, issue.key);
  const companyId = useWorkspaceCompanyId() as string;
  const [updateIssue] = useUpdateTelemetryIssueMutation();
  const replaceHref = contact?.email
    ? `${routes.EQUIP_EMPLOYEE}?recipients=${encodeURIComponent(contact.email)}`
    : routes.EMPLOYEES;
  const Icon = issue.key === "storage" ? HardDrive : BatteryLow;
  const ignored = Boolean(state.ignoredOn);
  const bad = issue.tone === "fail";

  return (
    <li className={cx("py-3.5 first:pt-0 last:pb-0", ignored && "opacity-60")}>
      <div className="flex gap-3.5">
        <span
          className={cx(
            "flex size-8 shrink-0 items-center justify-center rounded-lg",
            bad
              ? "bg-error-50 text-fg-error-primary"
              : "bg-warning-50 text-fg-warning-primary",
          )}
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-primary">
            {issue.title}
            <Tooltip
              title="Rayda does not send reminders for this. Nudging the holder cannot fix hardware."
              placement="top"
            >
              <TooltipTrigger className="cursor-default">
                <Badge color="gray" size="sm">
                  Not a reminder
                </Badge>
              </TooltipTrigger>
            </Tooltip>
            {ignored && (
              <Tooltip
                title={`Your team decided on ${state.ignoredOn} that this does not need action on this device.`}
                placement="top"
              >
                <TooltipTrigger className="cursor-default">
                  <Badge color="gray" size="sm">
                    Ignored
                  </Badge>
                </TooltipTrigger>
              </Tooltip>
            )}
          </p>
          <p className="text-sm text-tertiary">{issue.detail}</p>

          {!ignored && (
            <div className="mt-3 flex flex-wrap gap-2">
              {issue.action === "email" && contact && (
                <Button
                  size="sm"
                  color="secondary"
                  href={hardwareMailto(contact, deviceName, issue)}
                  data-testid="hardwareissuerow-button"
                >
                  Email {first} about it
                </Button>
              )}
              {issue.action === "replace" && (
                <Button
                  size="sm"
                  color="secondary"
                  href={replaceHref}
                  data-testid="hardwareissuerow-button-2"
                >
                  Start a replacement
                </Button>
              )}
              <Button
                size="sm"
                color="tertiary"
                onClick={() => {
                  void updateIssue({
                    companyId,
                    deviceId,
                    issue: issue.key,
                    ignored: true,
                  });
                }}
                data-testid="hardwareissuerow-button-3"
              >
                Ignore on this device
              </Button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
