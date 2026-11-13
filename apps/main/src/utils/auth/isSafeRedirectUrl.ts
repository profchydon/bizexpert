const SAFE_REDIRECT_PROTOCOLS = new Set(["http:", "https:"]);

export function isSafeRedirectUrl(
  value: string | null | undefined,
): value is string {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return SAFE_REDIRECT_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}

export function assignSafeRedirectUrl(
  value: string | null | undefined,
): boolean {
  if (!isSafeRedirectUrl(value)) {
    return false;
  }

  globalThis.location.assign(value);
  return true;
}

export function openSafeRedirectUrl(value: string | null | undefined): boolean {
  if (!isSafeRedirectUrl(value)) {
    return false;
  }

  globalThis.open(value, "_blank", "noopener,noreferrer");
  return true;
}
