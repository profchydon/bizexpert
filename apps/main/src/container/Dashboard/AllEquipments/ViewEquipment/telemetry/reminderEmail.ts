import type { AssignedContact } from "./assignedContact";
import type { HardwareIssue, HealthIssue } from "./deviceHealth";
import type { ReminderSchedule } from "./reminders";

// The way out of the automated loop. Rayda's own reminders have demonstrably not landed, so
// the escalation is a message from a colleague rather than a seventh nudge from a system:
// these draft it in the admin's own mail client, from their own address, addressed to the
// person holding the device. Rayda does not send it, which is the point.

function draft(
  contact: AssignedContact,
  subject: string,
  lines: string[],
): string {
  const first = contact.name.split(" ")[0] || "there";
  const body = [`Hi ${first},`, "", ...lines, "", "Thanks"].join("\r\n");
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function clause(
  issue: HealthIssue,
  deviceName: string,
  schedule: ReminderSchedule,
): string {
  return issue.tone === "fail"
    ? `${issue.title} on your ${deviceName}, and it has been that way for ${schedule.openDays} days.`
    : `The Rayda agent has not been able to confirm this on your ${deviceName}: ${issue.title.toLowerCase()}. It has stayed that way for ${schedule.openDays} days.`;
}

export function reminderMailto(
  contact: AssignedContact,
  deviceName: string,
  issue: HealthIssue,
  schedule: ReminderSchedule,
): string {
  const unverified = issue.tone !== "fail";
  return draft(
    contact,
    unverified
      ? `${issue.title} on your ${deviceName}`
      : `Action needed on your ${deviceName}: ${issue.title}`,
    [
      clause(issue, deviceName, schedule),
      "",
      issue.detail,
      "",
      `Rayda has sent ${schedule.sentCount} automated reminders about this and it is still open, so I wanted to reach you directly. Reply here if you are stuck and I will help you sort it out.`,
    ],
  );
}

// One message, every open problem. Writing separately about each check means the second
// mail lands as a duplicate on someone who has already ignored the first six reminders.
export function combinedMailto(
  contact: AssignedContact,
  deviceName: string,
  entries: { issue: HealthIssue; schedule: ReminderSchedule }[],
  hardware: HardwareIssue[] = [],
): string {
  const total = entries.reduce((n, e) => n + e.schedule.sentCount, 0);
  const lines = [`A few things need your attention on your ${deviceName}.`, ""];

  entries.forEach(({ issue, schedule }, i) => {
    lines.push(
      `${i + 1}. ${issue.title}. ${clause(issue, deviceName, schedule)} ${issue.detail}`,
      "",
    );
  });
  hardware.forEach((issue, i) => {
    lines.push(
      `${entries.length + i + 1}. ${issue.title}. ${issue.detail}`,
      "",
    );
  });

  lines.push(
    `Rayda has sent ${total} automated reminders about these and they are all still open, so I wanted to reach you directly rather than send another one. Reply here if you are stuck and I will help you sort it out.`,
  );
  return draft(
    contact,
    `A few things need your attention on your ${deviceName}`,
    lines,
  );
}

// Hardware has no reminder loop behind it, so this is the first contact rather than an
// escalation, and the copy does not claim otherwise.
export function hardwareMailto(
  contact: AssignedContact,
  deviceName: string,
  issue: HardwareIssue,
): string {
  return draft(contact, `${issue.title} on your ${deviceName}`, [
    `${issue.title} on your ${deviceName}.`,
    "",
    issue.detail,
    "",
    "There is nothing I can do about this from my side, so I wanted to flag it. Let me know if you would like a hand working out what to clear.",
  ]);
}

// Rayda has stopped collecting, but the binary is still on the machine and only the person holding
// it can remove it. This asks, which is the whole of what the product can do here.
export function uninstallMailto(
  contact: AssignedContact,
  deviceName: string,
): string {
  return draft(
    contact,
    `Please remove the Rayda agent from your ${deviceName}`,
    [
      `We have stopped collecting from your ${deviceName}, so the Rayda agent is no longer sending us anything.`,
      "",
      "It is still installed though, and only you can take it off. On Windows it is under Add or remove programs, and on a Mac it is in the Rayda folder in Applications.",
      "",
      "Nothing else is needed from you.",
    ],
  );
}
