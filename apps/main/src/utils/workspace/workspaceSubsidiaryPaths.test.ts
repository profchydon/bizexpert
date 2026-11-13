import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldAttachWorkspaceSubsidiaryParam } from "./workspaceSubsidiaryPaths";

describe("shouldAttachWorkspaceSubsidiaryParam", () => {
  it("scopes operational company endpoints used by entity workspaces", () => {
    const scopedUrls = [
      "/company-1/employees",
      "/company-1/employees/archived",
      "/company-1/equipments/in-storage/dashboard",
      "/company-1/dashboard",
      "/company-1/country-summary",
      "/company-1/orders",
      "/company-1/orders/order-1/messages",
      "/company-1/catalogs",
      "/company-1/catalog-policies/order-requests/pending-approvals",
      "/company-1/kits",
      "/company-1/rfqs",
      "/company-1/asset-refresh/list",
      "/company-1/departments",
      "/company-1/levels",
      "/company-1/job-titles",
      "/company-1/offices",
      "/company-1/offboard/orders/order-1",
      "/company-1/carts/users/user-1",
      "/company-1/fees/onboarding",
      "/company-1/assets",
    ];

    for (const url of scopedUrls) {
      assert.equal(shouldAttachWorkspaceSubsidiaryParam(url), true, url);
    }
  });

  it("does not rewrite employee self-profile resource paths onto the entity", () => {
    const selfProfileUrls = [
      "/company-1/employees/01a0a979-352c-7070-a22f-2b89ab453ea4",
      "/company-1/employees/01a0a979-352c-7070-a22f-2b89ab453ea4/dashboard",
      "/company-1/employees/01a0a979-352c-7070-a22f-2b89ab453ea4/equipment",
      "/company-1/employees/01a0ab34-bd6c-7227-91da-71e72dfbfb51/request",
    ];

    for (const url of selfProfileUrls) {
      assert.equal(shouldAttachWorkspaceSubsidiaryParam(url), false, url);
    }
  });

  it("does not scope global-only company endpoints", () => {
    const excludedUrls = [
      "/company-1/settings/users",
      "/company-1/transactions",
      "/company-1/onboarding/plan",
      "/company-1/integrations/all",
      "/company-1/entities",
      "/company-1/entities/entity-11",
      "/company-1/api-keys",
      "/company-1/mcp-credentials",
      "/company-1/agreement",
      "/company-1/wallet",
      "/company-1/join-requests",
      "/company-1/subscriptions/current",
    ];

    for (const url of excludedUrls) {
      assert.equal(shouldAttachWorkspaceSubsidiaryParam(url), false, url);
    }
  });
});
