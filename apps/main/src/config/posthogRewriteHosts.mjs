export const DEFAULT_POSTHOG_INGEST_HOST = "https://us.i.posthog.com";
export const DEFAULT_POSTHOG_ASSETS_HOST = "https://us-assets.i.posthog.com";

export function resolvePosthogIngestHost(env = process.env) {
  return env.POSTHOG_INGEST_HOST ?? DEFAULT_POSTHOG_INGEST_HOST;
}

export function derivePosthogAssetsHostFromIngest(ingestHost) {
  const match = ingestHost.match(
    /^https:\/\/([a-z0-9-]+)\.i\.posthog\.com\/?$/i,
  );
  if (!match) {
    return null;
  }
  return `https://${match[1]}-assets.i.posthog.com`;
}

export function resolvePosthogAssetsHost(env = process.env) {
  if (env.POSTHOG_ASSETS_HOST) {
    return env.POSTHOG_ASSETS_HOST;
  }
  const derived = derivePosthogAssetsHostFromIngest(
    resolvePosthogIngestHost(env),
  );
  return derived ?? DEFAULT_POSTHOG_ASSETS_HOST;
}
