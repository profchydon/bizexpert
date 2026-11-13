import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  resolveLiveIntegrationKey,
  isFinchIntegration,
} from "./liveIntegrationKey";

describe("resolveLiveIntegrationKey", () => {
  it("returns a service and slug key from nested integration data", () => {
    assert.equal(
      resolveLiveIntegrationKey({
        integration: {
          service: "apple",
          slug: "apple-business-manager",
        },
      }),
      "apple:apple-business-manager",
    );
  });

  it("returns finch when the integration service is finch", () => {
    assert.equal(
      resolveLiveIntegrationKey({
        integration: { service: "finch", slug: "bob" },
      }),
      "finch",
    );
  });

  it("falls back to top-level service and slug", () => {
    assert.equal(
      resolveLiveIntegrationKey({
        service: "google",
        slug: "google-workspace",
      }),
      "google:google-workspace",
    );
  });
});

describe("isFinchIntegration", () => {
  it("returns true when service is finch on the nested integration", () => {
    assert.equal(
      isFinchIntegration({
        integration: { service: "finch", slug: "bamboohr" },
      }),
      true,
    );
  });

  it("returns true when service is finch on the top-level record", () => {
    assert.equal(
      isFinchIntegration({ service: "finch", slug: "bamboohr" }),
      true,
    );
  });

  it("returns false for non-finch integrations", () => {
    assert.equal(
      isFinchIntegration({
        integration: { service: "apple", slug: "apple-business-manager" },
      }),
      false,
    );
  });
});
