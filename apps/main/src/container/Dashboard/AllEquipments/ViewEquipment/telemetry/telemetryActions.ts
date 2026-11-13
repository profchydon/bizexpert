"use client";

import { useGetTelemetryDeviceQuery } from "@/api/baseQueries/companiesApi/telemetryApi";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import type { TelemetryIssueAction } from "@/types/telemetry";

export interface IssueAction {
  pausedOn?: string;
  emailedOn?: string;
  handledOn?: string;
  ignoredOn?: string;
}

function labelFrom(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fromRow(action?: TelemetryIssueAction): IssueAction {
  if (!action) return {};
  return {
    pausedOn: labelFrom(action.paused_at),
    ignoredOn: labelFrom(action.ignored_at),
  };
}

export function useDeviceIssueActions(
  deviceId: string,
): (key: string) => IssueAction {
  const companyId = useWorkspaceCompanyId() as string;
  const query = useGetTelemetryDeviceQuery(
    { companyId, deviceId },
    { skip: !companyId || !deviceId },
  );
  const actions = query.data?.data.issue_actions ?? [];
  return (key: string) =>
    fromRow(actions.find((action) => action.issue_key === key));
}

export function useIssueAction(deviceId: string, key: string): IssueAction {
  const lookup = useDeviceIssueActions(deviceId);
  return lookup(key);
}

export function todayLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function recordEscalation(_deviceId: string, _key: string): void {}

export function markHandled(_deviceId: string, _key: string): void {}
