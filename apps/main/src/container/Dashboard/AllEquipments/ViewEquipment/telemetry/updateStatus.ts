import { dayLabel, dayTimeLabel, seedFor } from "./historyWindow";
import type { TelemetrySeed, UpdateOverride, UpdateStatus } from "./types";

// A fix that has sat undelivered this long has stopped being a task and started being
// neglect. A fortnight is seven times the two day fleet median, so it fires on a device
// left alone rather than on a normal working week.
//
// This measures how long the fix has been PENDING, not raw uptime. A device up 30 days
// whose update downloaded yesterday has had the fix pending one day, and is not overdue.
export const RESTART_OVERDUE_DAYS = 14;
const FLEET_MEDIAN_RESTART_DAYS = 2;

// Fixture presets rewrite the seed inputs rather than the derived state, so there stays a
// single derivation path and the panel cannot show a combination the real logic never makes.
const PRESETS: Record<
  Exclude<UpdateOverride, "default">,
  {
    pendingUpdates: number;
    lastRebootDays: number;
    downloadedDaysAgo: number | null;
  }
> = {
  current: { pendingUpdates: 0, lastRebootDays: 1, downloadedDaysAgo: null },
  available: { pendingUpdates: 2, lastRebootDays: 1, downloadedDaysAgo: null },
  // The combination the linear ladder could not express: nothing on disk to apply, and a
  // restart age that is a problem in its own right.
  available_stale_restart: {
    pendingUpdates: 2,
    lastRebootDays: 30,
    downloadedDaysAgo: null,
  },
  restart_required: {
    pendingUpdates: 2,
    lastRebootDays: 5,
    downloadedDaysAgo: 4,
  },
  restart_overdue: {
    pendingUpdates: 3,
    lastRebootDays: 24,
    downloadedDaysAgo: 23,
  },
};

// Applied to the seed itself, the way applyHealthScenario is, so every surface reading
// `patch` agrees. Rewriting it privately inside getUpdateStatus left the card's own
// "Time since restart" row and the verdict band's restart vital on the original value,
// contradicting the pending figure right beside them.
export function applyUpdateOverride(
  seed: TelemetrySeed,
  override: UpdateOverride,
): TelemetrySeed {
  return override === "default"
    ? seed
    : { ...seed, patch: { ...seed.patch, ...PRESETS[override] } };
}

// Bumps the last build segment so "latest available" reads as a real newer version of the
// same line rather than an invented one.
function nextBuild(build: string): string {
  const parts = build.split(".");
  const tail = Number(parts[parts.length - 1]);
  if (!Number.isFinite(tail)) return build;
  parts[parts.length - 1] = String(tail + 430);
  return parts.join(".");
}

function uptime(days: number): string {
  const hours = 2 + (days % 9);
  return days === 0 ? `${hours}h` : `${days}d ${hours}h`;
}

// Deliberately absent: how many times the OS has shown its own restart prompt. Those are
// system notifications the agent has no view into, so a count here would be invented.
// Time pending and last restart carry what actually matters: the fix is not live yet.
export function getUpdateStatus(id: string, seed: TelemetrySeed): UpdateStatus {
  const { os, patch } = seed;
  const s = seedFor(id, "update");
  const pending = patch.pendingUpdates > 0;
  // Downloaded is its own fact now, not a guess from uptime. Restarting cannot apply an
  // update that is not on disk, so a device with nothing downloaded is simply "available"
  // however long it has been up.
  const downloaded = pending && patch.downloadedDaysAgo !== null;
  // Bounded by the last restart: a restart after the download would have applied the fix,
  // so the fix can only have been undelivered since whichever happened later.
  const pendingRestartDays = downloaded
    ? Math.min(patch.downloadedDaysAgo as number, patch.lastRebootDays)
    : null;
  const overdue =
    pendingRestartDays !== null && pendingRestartDays >= RESTART_OVERDUE_DAYS;

  // "Windows 22631.4460" drops the release the build belongs to, so the line names both.
  const line = `${os.name} ${os.version.split(" ")[0]}`;
  return {
    latestOsVersion: pending
      ? `${line} ${nextBuild(os.build)}`
      : `${line} ${os.build}`,
    state: !pending
      ? "current"
      : !downloaded
        ? "available"
        : overdue
          ? "restart_overdue"
          : "restart_required",
    downloadedOnLabel: downloaded
      ? dayLabel(patch.downloadedDaysAgo as number)
      : null,
    pendingRestartDays,
    lastRestartLabel: dayTimeLabel(patch.lastRebootDays, s),
    uptimeLabel: uptime(patch.lastRebootDays),
    fleetMedianRestartDays: FLEET_MEDIAN_RESTART_DAYS,
    // Independent of the update state, so a long restart age still reads on a device whose
    // badge correctly says "update available".
    restartAgeOverdue: patch.lastRebootDays >= RESTART_OVERDUE_DAYS,
  };
}

export const UPDATE_STATE_LABEL: Record<UpdateStatus["state"], string> = {
  current: "Up to date",
  restart_required: "Restart required",
  restart_overdue: "Restart overdue",
  available: "Update available",
  unknown: "Not verified",
};

export const UPDATE_STATE_TOOLTIP: Record<UpdateStatus["state"], string> = {
  current: "Running the latest build the agent knows about.",
  restart_required:
    "The update is on disk. Its fix is not active until the device restarts.",
  restart_overdue: `The fix has been on disk over ${RESTART_OVERDUE_DAYS} days and is still not live.`,
  available:
    "A newer build exists but is not on the device yet. Restarting will not apply it.",
  unknown: "The agent could not read the update state.",
};

export const UPDATE_STATE_BADGE: Record<
  UpdateStatus["state"],
  "success" | "warning" | "error" | "gray"
> = {
  current: "success",
  restart_required: "error",
  restart_overdue: "error",
  available: "warning",
  unknown: "gray",
};

// The interpretation, not a repeat of the badge or of the "pending restart for" row that
// sits directly beneath it in the card.
export const UPDATE_STATE_READING: Record<UpdateStatus["state"], string> = {
  current: "Nothing pending",
  restart_required: "Restart to apply",
  restart_overdue: "Well past the fleet median",
  available: "Ready to install",
  unknown: "Not verified",
};

export const UPDATE_STATE_TEXT: Record<UpdateStatus["state"], string> = {
  current: "text-success-primary",
  restart_required: "text-error-primary",
  restart_overdue: "text-error-primary",
  available: "text-warning-primary",
  unknown: "text-tertiary",
};
