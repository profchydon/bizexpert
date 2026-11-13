import type { ComplianceChecks } from "./types";

// One interpretive sentence per signal, per state. This is the difference between a
// readout and a tool: a number with a sentence beside it tells the admin what to do.
// Passing checks get no sentence on purpose. Severity is what earns words.

export type CheckKey = keyof ComplianceChecks;

export const CHECK_ORDER: CheckKey[] = [
  "encryption",
  "firewall",
  "antivirus",
  "screenLock",
  "osPatch",
];

export const CHECK_LABEL: Record<CheckKey, string> = {
  encryption: "Encryption",
  firewall: "Firewall",
  antivirus: "Antivirus",
  screenLock: "Screen lock",
  osPatch: "OS updates",
};

export const CHECK_TOOLTIP: Record<CheckKey, string> = {
  encryption:
    "Whether the disk is encrypted, so data is unreadable if the device is lost.",
  firewall: "Whether inbound connections are filtered.",
  antivirus:
    "Whether the agent detected a real antivirus product, rather than assuming one.",
  screenLock: "Whether the device locks itself when idle.",
  osPatch: "Whether security patches are current.",
};

interface Issue {
  title: string;
  detail: string;
}

export const CHECK_FAILURE: Record<CheckKey, Issue> = {
  encryption: {
    title: "Disk is not encrypted",
    detail:
      "Anyone who takes this device can read what is on it. Turn encryption on before anything else.",
  },
  firewall: {
    title: "Firewall is off",
    detail:
      "This device accepts inbound connections without filtering. Switch it back on.",
  },
  antivirus: {
    title: "No antivirus detected",
    detail:
      "The agent looked and found nothing running. Install a product or confirm the one in use.",
  },
  screenLock: {
    title: "Screen lock is not set",
    detail:
      "The device stays open when it is left alone. Set an idle lock in the OS settings.",
  },
  osPatch: {
    title: "OS updates are behind",
    detail:
      "Pending security patches leave known gaps open. Install them and restart.",
  },
};

// Agent side faults, not device faults. These explain WHY a check reads "not yet
// verified": the agent ran and could not get an answer, which is a different problem from
// the device failing the check.
export const CHECK_READ_ERROR: Record<CheckKey, string> = {
  encryption: "Agent could not read the disk encryption state.",
  firewall: "Agent could not read the firewall state.",
  antivirus: "Agent could not detect an antivirus product.",
  screenLock: "Agent could not read the screen lock policy.",
  osPatch: "Agent could not read the update history.",
};

// Past tense, for the agent log: what happened, not what is true now.
export const CHECK_EVENT: Record<CheckKey, string> = {
  encryption: "Disk encryption was switched off.",
  firewall: "Firewall was turned off.",
  antivirus: "Antivirus stopped being detected.",
  screenLock: "Screen lock was removed.",
  osPatch: "OS updates fell behind.",
};

export const CHECK_UNVERIFIED: Record<CheckKey, Issue> = {
  encryption: {
    title: "Encryption not yet verified",
    detail:
      "The agent has not confirmed the disk state. Treat this as unknown, not as encrypted.",
  },
  firewall: {
    title: "Firewall not yet verified",
    detail:
      "The agent has not confirmed the firewall state. Treat this as unknown, not as on.",
  },
  antivirus: {
    title: "Antivirus not yet verified",
    detail:
      "The agent has never confirmed a product here. Unknown is not the same as clean.",
  },
  screenLock: {
    title: "Screen lock not yet verified",
    detail: "The agent has not read the lock policy on this device yet.",
  },
  osPatch: {
    title: "Patch status not yet verified",
    detail: "The agent has not confirmed which updates are installed.",
  },
};
