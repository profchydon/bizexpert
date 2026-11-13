import type { RuleRunEntry } from "./types";
import { formatRunOutcome } from "./utilsRunHistory";

export function formatRunDetailTime(value: string) {
  const date = new Date(value);
  return `${date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} · ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function getRunOutcomeExplanation(entry: RuleRunEntry) {
  if (entry.outcome === "MATCHED") {
    return "This rule matched the employee's profile and its kit was assigned during onboarding.";
  }
  if (entry.outcome === "SUPERSEDED") {
    return "This rule matched the employee's profile, but a more specific policy took precedence.";
  }
  if (entry.outcome === "FAILED") {
    return "This rule could not be applied to the employee during this run.";
  }
  if (entry.outcome === "RESOLVED") {
    return "This run was manually resolved after the original backend outcome.";
  }
  return "This employee did not match the policy criteria during this run.";
}

export function formatRunPayload(payload?: Record<string, unknown> | null) {
  if (!payload || Object.keys(payload).length === 0) return "No payload data.";
  return JSON.stringify(payload, null, 2);
}

export function formatRunTrigger(entry: RuleRunEntry) {
  if (entry.triggerType === "MANUAL") return "Manual";
  if (entry.triggerType === "OVERRIDE") return "Operator override";
  return "HRIS sync";
}

export function getRunDetailNotes(entry: RuleRunEntry) {
  if (entry.notes) return entry.notes;
  const payload = entry.failurePayload;
  const message = payload?.message ?? payload?.error ?? payload?.reason;
  return typeof message === "string" ? message : "No notes added.";
}

export function formatRunSummary(entry: RuleRunEntry) {
  return `${formatRunOutcome(entry.outcome)} · ${formatRunDetailTime(entry.triggeredAt)}`;
}
