import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_POSTHOG_ASSETS_HOST,
  DEFAULT_POSTHOG_INGEST_HOST,
  derivePosthogAssetsHostFromIngest,
  resolvePosthogAssetsHost,
  resolvePosthogIngestHost,
} from "./posthogRewriteHosts.mjs";

describe("posthogRewriteHosts", () => {
  it("defaults ingest to US cloud when unset", () => {
    assert.equal(resolvePosthogIngestHost({}), DEFAULT_POSTHOG_INGEST_HOST);
  });

  it("uses POSTHOG_INGEST_HOST when set", () => {
    assert.equal(
      resolvePosthogIngestHost({
        POSTHOG_INGEST_HOST: "https://eu.i.posthog.com",
      }),
      "https://eu.i.posthog.com",
    );
  });

  it("derives assets host from regional ingest host", () => {
    assert.equal(
      derivePosthogAssetsHostFromIngest("https://eu.i.posthog.com"),
      "https://eu-assets.i.posthog.com",
    );
  });

  it("defaults assets to US when ingest is default and override unset", () => {
    assert.equal(resolvePosthogAssetsHost({}), DEFAULT_POSTHOG_ASSETS_HOST);
  });

  it("derives assets from ingest when only ingest is customized", () => {
    assert.equal(
      resolvePosthogAssetsHost({
        POSTHOG_INGEST_HOST: "https://eu.i.posthog.com",
      }),
      "https://eu-assets.i.posthog.com",
    );
  });

  it("prefers explicit POSTHOG_ASSETS_HOST", () => {
    assert.equal(
      resolvePosthogAssetsHost({
        POSTHOG_INGEST_HOST: "https://eu.i.posthog.com",
        POSTHOG_ASSETS_HOST: "https://custom.example.com",
      }),
      "https://custom.example.com",
    );
  });
});
