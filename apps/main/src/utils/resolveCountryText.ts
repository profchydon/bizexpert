export const resolveCountryText = (value: unknown): string | undefined => {
  if (value == null) {
    return undefined;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (typeof value === "object") {
    const record = value as {
      name?: unknown;
      label?: unknown;
      code?: unknown;
    };

    return (
      resolveCountryText(record.name) ??
      resolveCountryText(record.label) ??
      resolveCountryText(record.code)
    );
  }

  const coerced = String(value).trim();
  return coerced.length > 0 ? coerced : undefined;
};

export const resolveCountryCode = (
  countryCode: unknown,
  country: unknown,
): string | undefined => {
  const directCode = resolveCountryText(countryCode);
  if (directCode) {
    return directCode.toUpperCase();
  }

  if (country != null && typeof country === "object") {
    const record = country as { code?: unknown };
    const nestedCode = resolveCountryText(record.code);
    if (nestedCode) {
      return nestedCode.toUpperCase();
    }
  }

  return undefined;
};
