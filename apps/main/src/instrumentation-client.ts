import * as Sentry from "@sentry/nextjs";
import { getSentryEnvironment } from "@/config/sentry";

const isBizExpert = process.env.NEXT_PUBLIC_PRODUCT === "bizexpert";

if (!isBizExpert) {
  Sentry.init({
    dsn: "https://18493294e9fbab32ae7fe04a2739cd50@o1229776.ingest.us.sentry.io/4507786195697664",
    environment: getSentryEnvironment(),
    tracesSampleRate: 1,
    debug: false,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
  });
}

export const onRouterTransitionStart = isBizExpert
  ? () => {}
  : Sentry.captureRouterTransitionStart;
