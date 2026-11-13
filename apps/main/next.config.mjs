import { withSentryConfig } from "@sentry/nextjs";
import { withLogtail } from "@logtail/next";
import {
  resolvePosthogAssetsHost,
  resolvePosthogIngestHost,
} from "./src/config/posthogRewriteHosts.mjs";
import {
  SECURITY_HEADER_SOURCE,
  securityHeaders,
} from "./src/config/securityHeaders.mjs";

const posthogIngestHost = resolvePosthogIngestHost();
const posthogAssetsHost = resolvePosthogAssetsHost();
const isBizExpert = process.env.NEXT_PUBLIC_PRODUCT === "bizexpert";

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    "require-in-the-middle",
    "import-in-the-middle",
    "@sentry/node",
    "@sentry/nextjs",
  ],
  skipTrailingSlashRedirect: true,
  async headers() {
    return [
      {
        source: SECURITY_HEADER_SOURCE,
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/overview",
        permanent: false,
      },
      {
        source: "/dashboard/",
        destination: "/dashboard/overview",
        permanent: false,
      },
      {
        source: "/new-onboarding/:path*",
        destination: "/onboarding/:path*",
        permanent: false,
      },
      {
        source: "/auth/office-admin-invite",
        destination: "/auth/entity-admin-invite",
        permanent: false,
      },
      {
        source: "/auth/office-admin-invite/",
        destination: "/auth/entity-admin-invite",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: `${posthogAssetsHost}/static/:path*`,
      },
      {
        source: "/ingest/:path*",
        destination: `${posthogIngestHost}/:path*`,
      },
    ];
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdsassets.apple.com",
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "assets.rayda.co",
      },
    ],
  },
};

const sentryConfig = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "raydahq",
  project: "remote-v2-frontend",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  hideSourceMaps: true,

  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // These webpack-only options are no-ops under Turbopack (see the Sentry SDK's
  // own notice), but keep them under `webpack` so `next build --webpack` still
  // gets tree-shaken logging, Vercel Cron monitors, and component annotations
  // without deprecation warnings.
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
    automaticVercelMonitors: true,
    reactComponentAnnotation: {
      enabled: true,
    },
  },
});

const appConfig = isBizExpert ? nextConfig : sentryConfig;

export default withLogtail(appConfig, {
  sourceToken: process.env.NEXT_PUBLIC_LOGTAIL_SOURCE_TOKEN,
});
