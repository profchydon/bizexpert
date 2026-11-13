"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, type ReactElement } from "react";
import { getRawAppEnv, resolveAppEnv } from "@/config/featureFlags";
import {
  POSTHOG_CLIENT_API_HOST,
  POSTHOG_CLIENT_UI_HOST,
} from "@/lib/posthogClientConfig";
import {
  POSTHOG_MISSING_KEY_DEV_MESSAGE,
  POSTHOG_MISSING_KEY_PROD_MESSAGE,
  POSTHOG_SESSION_RECORDING,
  resolvePostHogInitDecision,
} from "@/lib/posthogInitGuard";

const processKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (typeof window !== "undefined") {
  const initDecision = resolvePostHogInitDecision(
    processKey,
    resolveAppEnv(getRawAppEnv()),
  );

  if (initDecision === "init") {
    posthog.init(processKey!, {
      api_host: POSTHOG_CLIENT_API_HOST,
      ui_host: POSTHOG_CLIENT_UI_HOST,
      capture_pageview: false,
      session_recording: POSTHOG_SESSION_RECORDING,
    });
    posthog.register({ environment: resolveAppEnv(getRawAppEnv()) });
  } else if (initDecision === "missing-dev") {
    console.error(POSTHOG_MISSING_KEY_DEV_MESSAGE);
  } else {
    console.warn(POSTHOG_MISSING_KEY_PROD_MESSAGE);
  }
}

export function PostHogPageview(): ReactElement {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return <></>;
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
