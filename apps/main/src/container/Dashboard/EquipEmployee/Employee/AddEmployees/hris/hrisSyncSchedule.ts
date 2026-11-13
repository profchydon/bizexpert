export function parseIntegrationDateTime(value: string): Date | null {
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function getSyncFrequencyMs(syncFrequency?: string): number | null {
  switch (syncFrequency) {
    case "Daily":
      return 24 * 60 * 60 * 1000;
    case "Weekly":
      return 7 * 24 * 60 * 60 * 1000;
    case "Bi-weekly":
      return 14 * 24 * 60 * 60 * 1000;
    case "Monthly":
      return 30 * 24 * 60 * 60 * 1000;
    default:
      return null;
  }
}

export function formatRelativeDuration(ms: number): string {
  const minutes = Math.ceil(ms / (60 * 1000));
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  const hours = Math.ceil(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  const days = Math.ceil(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
}

export function formatLastSyncAt(value?: string | null): string {
  if (!value) {
    return "Not synced yet";
  }

  const date = parseIntegrationDateTime(value);
  if (!date) {
    return "Not synced yet";
  }

  return date.toLocaleString();
}

export function formatNextSyncIn(
  lastSyncAt?: string | null,
  syncFrequency?: string | null,
  now: Date = new Date(),
): string {
  if (!lastSyncAt) {
    return "Not scheduled";
  }

  const lastSyncDate = parseIntegrationDateTime(lastSyncAt);
  if (!lastSyncDate) {
    return "Not scheduled";
  }

  const frequencyMs = getSyncFrequencyMs(syncFrequency ?? undefined);
  if (!frequencyMs) {
    return "Not scheduled";
  }

  const nextSyncAt = new Date(lastSyncDate.getTime() + frequencyMs);
  const diffMs = nextSyncAt.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "Due now";
  }

  return formatRelativeDuration(diffMs);
}
