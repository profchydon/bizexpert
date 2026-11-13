export const INTEGRATION_SYNC_FREQUENCY_OPTIONS = [
  { label: "Daily (Every 24hrs)", value: "Daily" },
  { label: "Weekly (Every 7days)", value: "Weekly" },
  { label: "Bi-weekly (Every 14days)", value: "Bi-weekly" },
  { label: "Monthly (Every 30days)", value: "Monthly" },
] as const;

export type IntegrationSyncFrequencyOption = {
  value: string;
  label: string;
};

const TICKET_INGEST_PROVIDERS = new Set(["jira", "zendesk", "zoho-desk"]);

export function supportsTicketIngestSync(slug: string): boolean {
  return TICKET_INGEST_PROVIDERS.has(slug);
}

export function toSyncFrequencyOption(
  option: unknown,
): IntegrationSyncFrequencyOption | null {
  if (!option || typeof option !== "object" || Array.isArray(option)) {
    return null;
  }

  const value = "value" in option ? option.value : undefined;
  const label = "label" in option ? option.label : undefined;
  if (typeof value !== "string") {
    return null;
  }

  return {
    value,
    label: typeof label === "string" ? label : value,
  };
}

export function syncFrequencyOptionFor(
  value?: string | null,
): IntegrationSyncFrequencyOption {
  const match = INTEGRATION_SYNC_FREQUENCY_OPTIONS.find(
    (option) => option.value === value,
  );
  const fallback =
    INTEGRATION_SYNC_FREQUENCY_OPTIONS.find(
      (option) => option.value === "Weekly",
    ) ?? INTEGRATION_SYNC_FREQUENCY_OPTIONS[1];
  const selected = match ?? fallback;
  return { value: selected.value, label: selected.label };
}
