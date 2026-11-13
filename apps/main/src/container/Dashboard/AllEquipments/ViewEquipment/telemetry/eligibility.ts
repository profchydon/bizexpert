const ELIGIBLE_TYPES = new Set<string>([
  "Computer",
  "Laptop",
  "Laptop/Workstation",
  "Desktop",
  "Phone",
  "Phones",
  "Smartphone",
  "Tablet",
]);

export function telemetryEligible(type: string | undefined | null): boolean {
  return Boolean(type && ELIGIBLE_TYPES.has(type));
}
