/**
 * Normalize a currency value to a display symbol. The order API sends a flat
 * `currency` string that is meant to be a symbol, but some currencies fall
 * back to their ISO code (e.g. "GBP" instead of "£"). This resolver converts a
 * 3-letter ISO code to its narrow symbol via Intl, and passes anything that is
 * already a symbol (or otherwise not a 3-letter code) through unchanged, so it
 * is safe to apply to a field that may already hold a symbol. Empty input
 * returns an empty string (never a misleading "$" default).
 */
export function currencySymbol(value?: string | null): string {
  if (!value) {
    return "";
  }

  const normalized = value.trim().toUpperCase();

  if (normalized.length !== 3) {
    return value;
  }

  try {
    const symbol = new Intl.NumberFormat("en", {
      style: "currency",
      currency: normalized,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value;

    return symbol ?? normalized;
  } catch {
    return normalized;
  }
}

export default currencySymbol;
