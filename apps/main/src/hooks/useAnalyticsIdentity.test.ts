import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { IImpersonationSession } from "@/types/auth";
import { shouldSuppressAnalyticsIdentity } from "./useAnalyticsIdentity";

const impersonationSession: IImpersonationSession = {
  admin_id: "admin_1",
  admin_name: "Rayda Staff",
  company_id: "company_1",
  expires_at: "2026-12-31T23:59:59.000Z",
};

describe("shouldSuppressAnalyticsIdentity", () => {
  it("returns true when an impersonation session is present", () => {
    assert.equal(shouldSuppressAnalyticsIdentity(impersonationSession), true);
  });

  it("returns false when impersonation is null", () => {
    assert.equal(shouldSuppressAnalyticsIdentity(null), false);
  });

  it("returns false when impersonation is undefined", () => {
    assert.equal(shouldSuppressAnalyticsIdentity(undefined), false);
  });
});
