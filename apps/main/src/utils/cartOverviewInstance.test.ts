import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveCartOverviewVariant } from "./cartOverviewInstance";

const params = (values: Record<string, string>) => ({
  get: (key: string) => values[key] ?? null,
});

describe("resolveCartOverviewVariant", () => {
  it("uses the marketplace cart for standard onboarding and buy-to-storage", () => {
    assert.equal(resolveCartOverviewVariant(params({})), "marketplace");
    assert.equal(
      resolveCartOverviewVariant(params({ catalogId: "abc" })),
      "marketplace",
    );
  });

  it("uses the legacy cart for device refresh", () => {
    assert.equal(
      resolveCartOverviewVariant(params({ "device-refresh": "true" })),
      "legacy",
    );
  });

  it("uses the legacy cart for extra_items marketplace additions", () => {
    assert.equal(
      resolveCartOverviewVariant(params({ extra_items: "true" })),
      "legacy",
    );
  });

  it("does not treat stale query values as device refresh", () => {
    assert.equal(
      resolveCartOverviewVariant(params({ "device-refresh": "false" })),
      "marketplace",
    );
  });
});
