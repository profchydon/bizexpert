const SPEC_KEY_LABELS: Record<string, string> = {
  display: "Display",
  memory: "Memory",
  storage: "Storage",
  processor: "Processor",
};

function formatSpecLabel(key: string): string {
  if (SPEC_KEY_LABELS[key]) return SPEC_KEY_LABELS[key];
  return key
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function mapDetailSpecifications(specs: Record<string, string>) {
  return Object.entries(specs).map(([key, value]) => ({
    label: formatSpecLabel(key),
    value,
  }));
}
