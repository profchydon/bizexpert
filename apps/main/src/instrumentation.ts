const isBizExpert = process.env.NEXT_PUBLIC_PRODUCT === "bizexpert";

export async function register() {
  if (isBizExpert) {
    return;
  }

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export async function onRequestError(
  ...args: Parameters<
    typeof import("@sentry/nextjs").captureRequestError
  >
) {
  if (isBizExpert) {
    return;
  }
  const Sentry = await import("@sentry/nextjs");
  return Sentry.captureRequestError(...args);
}
