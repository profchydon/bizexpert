import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  POSTHOG_CLIENT_API_HOST,
  POSTHOG_CLIENT_UI_HOST,
} from "./posthogClientConfig";

describe("posthogClientConfig", () => {
  it("routes browser ingestion through the app origin proxy", () => {
    assert.equal(POSTHOG_CLIENT_API_HOST, "/ingest");
  });

  it("points session links at the US PostHog app host", () => {
    assert.equal(POSTHOG_CLIENT_UI_HOST, "https://us.posthog.com");
  });
});
