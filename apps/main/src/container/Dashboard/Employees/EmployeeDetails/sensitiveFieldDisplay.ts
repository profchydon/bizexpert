export const SENSITIVE_FIELD_EMPTY = "—";

export function hasSensitiveValue(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed !== SENSITIVE_FIELD_EMPTY;
}

export function maskedSensitiveValue(value: string) {
  return "•".repeat(Math.min(value.length, 18));
}

export function displaySensitiveValue(value: string, revealed: boolean) {
  if (!hasSensitiveValue(value)) {
    return SENSITIVE_FIELD_EMPTY;
  }

  if (revealed) {
    return value;
  }

  return maskedSensitiveValue(value);
}
