import type { TriState } from "./types";

// Centralized tooltip copy so the same badge means the same thing on every surface
// (CLAUDE.md rule 9). Keep each under ~12 words, plain language, no dashes.

export const TRI_STATE_LABEL: Record<TriState, string> = {
  pass: "Pass",
  fail: "Fail",
  not_verified: "Not yet verified",
};

export const TRI_STATE_TOOLTIP: Record<TriState, string> = {
  pass: "The agent confirmed this check on its last sync.",
  fail: "The agent confirmed this check is failing. Action needed.",
  not_verified: "The agent has not confirmed this signal yet. Not a pass.",
};

export const STALE_TOOLTIP =
  "No sync in over 7 days. Readings may be out of date.";

export const AGENT_NOT_INSTALLED_TOOLTIP =
  "The Rayda agent is not on this device yet.";

export const REVOKED_TOOLTIP =
  "Rayda has stopped collecting from this device. The agent may still be installed.";

export const AGENT_ACTIVE_TOOLTIP =
  "The Rayda agent synced within the last 7 days.";

export const PWA_TOOLTIP =
  "A web app installed through Chrome, not native software.";

export const DISCOVERED_TOOLTIP =
  "Found by the telemetry agent. Not in your Device Fleet yet.";
