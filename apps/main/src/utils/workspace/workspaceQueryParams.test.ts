import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveWorkspaceRequestUrl } from "./workspaceQueryParams";

describe("resolveWorkspaceRequestUrl", () => {
  it("rewrites scoped company requests to the active entity id", () => {
    assert.equal(
      resolveWorkspaceRequestUrl(
        "/company-primary/orders",
        "company-primary",
        "entity-11",
      ),
      "/entity-11/orders",
    );
  });
});
