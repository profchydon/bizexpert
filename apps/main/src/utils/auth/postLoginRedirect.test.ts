import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sanitizePostLoginRedirect } from "./postLoginRedirect.ts";

describe("sanitizePostLoginRedirect", () => {
  it("drops the workspace entity so the next account does not inherit it", () => {
    assert.equal(
      sanitizePostLoginRedirect(
        "/dashboard/overview?entity=01a126d8-26bf-72df-a9d0-da90d3223ccc",
      ),
      "/dashboard/overview",
    );
  });

  it("keeps other query params", () => {
    assert.equal(
      sanitizePostLoginRedirect(
        "/dashboard/orders?tab=open&entity=entity-11&list_page=2",
      ),
      "/dashboard/orders?tab=open&list_page=2",
    );
  });

  it("rejects paths that are not on this app", () => {
    assert.equal(sanitizePostLoginRedirect("https://example.com"), null);
    assert.equal(sanitizePostLoginRedirect("//example.com"), null);
    assert.equal(sanitizePostLoginRedirect(null), null);
  });
});
