const PLACEHOLDER_PARTS = new Set([
  "not applicable",
  "n/a",
  "na",
  "none",
  "null",
  "undefined",
  "-",
]);

export function joinLabelParts(
  ...parts: (string | undefined | null)[]
): string {
  return parts
    .map((part) => `${part ?? ""}`.trim())
    .filter((part) => part && !PLACEHOLDER_PARTS.has(part.toLowerCase()))
    .join(" ");
}
