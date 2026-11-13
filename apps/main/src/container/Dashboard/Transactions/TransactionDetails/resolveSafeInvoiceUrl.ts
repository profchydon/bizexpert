export function resolveSafeInvoiceUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  try {
    const parsed = new URL(url);

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}
