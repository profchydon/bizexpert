// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { getSentryEnvironment } from "./src/config/sentry";

Sentry.init({
  dsn: "https://18493294e9fbab32ae7fe04a2739cd50@o1229776.ingest.us.sentry.io/4507786195697664",
  environment: getSentryEnvironment(),

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: process.env.NODE_ENV === 'development',
});
