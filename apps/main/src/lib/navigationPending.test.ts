import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  hrefToRoutePath,
  isInternalAppHref,
  normalizeRoutePath,
  shouldStartNavigation,
} from "./navigationPending";

describe("navigationPending", () => {
  const origin = "https://app.rayda.com";

  it("detects route changes", () => {
    assert.equal(
      shouldStartNavigation("/dashboard/employees", "/dashboard/orders"),
      true,
    );
    assert.equal(
      shouldStartNavigation(
        "/dashboard/employees?page=1",
        "/dashboard/employees?page=1",
      ),
      false,
    );
  });

  it("normalizes absolute and relative urls", () => {
    assert.equal(
      normalizeRoutePath("/dashboard/employees?tab=active", origin),
      "/dashboard/employees?tab=active",
    );
    assert.equal(
      normalizeRoutePath(`${origin}/dashboard/employees`, origin),
      "/dashboard/employees",
    );
  });

  it("accepts only internal app links", () => {
    assert.equal(isInternalAppHref("/dashboard/employees", origin), true);
    assert.equal(isInternalAppHref("#section", origin), false);
    assert.equal(isInternalAppHref("https://example.com", origin), false);
    assert.equal(
      isInternalAppHref(`${origin}/dashboard/employees`, origin),
      true,
    );
  });

  it("maps hrefs to route paths", () => {
    assert.equal(
      hrefToRoutePath("/dashboard/employees", origin),
      "/dashboard/employees",
    );
    assert.equal(hrefToRoutePath("https://example.com", origin), null);
  });
});
