const CONFIGURED_IMAGE_HOSTS = new Set([
  "cdsassets.apple.com",
  "s3.amazonaws.com",
  "assets.rayda.co",
]);

export function formatSafeImageSrc(src: unknown): string {
  if (typeof src !== "string") return "";
  const trimmed = src.trim();

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  return `/${trimmed.replace(/^\/+/, "")}`;
}

export function isConfiguredRemoteImage(src: string): boolean {
  if (!/^https?:\/\//i.test(src)) {
    return true;
  }

  try {
    return CONFIGURED_IMAGE_HOSTS.has(new URL(src).hostname);
  } catch {
    return false;
  }
}

export function resolveSafeImageSrc(
  src: unknown,
  hasError: boolean,
  placeholderSrc: string,
): string {
  const formattedSrc = formatSafeImageSrc(src);

  if (!formattedSrc || hasError) {
    return placeholderSrc;
  }

  return formattedSrc;
}
