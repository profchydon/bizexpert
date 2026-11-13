import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  resolveWorkspaceApiCompanyId,
  resolveWorkspaceRequestUrl,
  rewriteWorkspaceCompanyIdInUrl,
} from "./workspaceApiCompanyId";

describe("resolveWorkspaceApiCompanyId", () => {
  it("uses the active entity id when an entity workspace is selected", () => {
    assert.equal(
      resolveWorkspaceApiCompanyId("company-primary", "entity-11"),
      "entity-11",
    );
  });

  it("falls back to the primary company id in the global workspace", () => {
    assert.equal(
      resolveWorkspaceApiCompanyId("company-primary", null),
      "company-primary",
    );
  });
});

describe("resolveWorkspaceRequestUrl", () => {
  it("rewrites scoped operational company paths to the active entity id", () => {
    assert.equal(
      resolveWorkspaceRequestUrl(
        "/company-primary/employees",
        "company-primary",
        "entity-11",
      ),
      "/entity-11/employees",
    );
  });

  it("leaves employee self-profile paths on the primary company id", () => {
    assert.equal(
      resolveWorkspaceRequestUrl(
        "/company-primary/employees/01a0a979-352c-7070-a22f-2b89ab453ea4/dashboard",
        "company-primary",
        "entity-11",
      ),
      "/company-primary/employees/01a0a979-352c-7070-a22f-2b89ab453ea4/dashboard",
    );
  });

  it("leaves global-only company paths on the primary company id", () => {
    assert.equal(
      resolveWorkspaceRequestUrl(
        "/company-primary/settings/users",
        "company-primary",
        "entity-11",
      ),
      "/company-primary/settings/users",
    );
  });

  it("does not rewrite requests that already target the active entity id", () => {
    assert.equal(
      rewriteWorkspaceCompanyIdInUrl(
        "/entity-11/employees",
        "company-primary",
        "entity-11",
      ),
      "/entity-11/employees",
    );
  });
});
