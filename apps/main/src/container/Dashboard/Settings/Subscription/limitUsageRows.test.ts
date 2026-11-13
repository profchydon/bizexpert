import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { SubscriptionEntitlement } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContract";
import { limitUsageRows } from "./limitUsageRows";

function entitlement(
  overrides: Partial<SubscriptionEntitlement> &
    Pick<SubscriptionEntitlement, "code" | "value_type">,
): SubscriptionEntitlement {
  return {
    name: overrides.code,
    value: "0",
    unit: null,
    allowed: true,
    unlimited: false,
    usage: 0,
    remaining: null,
    soft_warning: false,
    ...overrides,
  };
}

describe("limit usage", () => {
  it("shows counted usage and hides gates that are not limits", () => {
    const rows = limitUsageRows([
      entitlement({
        code: "offices",
        name: "Offices",
        value_type: "numeric_limit",
        value: "5",
        usage: 3,
        remaining: 2,
      }),
      entitlement({
        code: "admin_users",
        name: "Admin users",
        value_type: "numeric_limit",
        unlimited: true,
        usage: 4,
      }),
      entitlement({
        code: "resolve_actions",
        name: "Rayda Resolve",
        value_type: "metered",
        value: "150",
        unit: "actions",
        usage: 140,
        remaining: 10,
        soft_warning: true,
      }),
      entitlement({
        code: "api_access",
        value_type: "boolean",
        value: "true",
      }),
    ]);

    assert.deepEqual(
      rows.map((row) => row.label),
      ["3 of 5", "4 used · Unlimited", "140 of 150 actions · Near limit"],
    );
    assert.equal(rows[2]?.softWarning, true);
    assert.equal(rows[1]?.atLimit, false);
  });

  it("hides seat and tags from the usage list", () => {
    const rows = limitUsageRows([
      entitlement({
        code: "catalog_limit",
        name: "Catalog",
        value_type: "numeric_limit",
        unlimited: true,
        usage: 4,
      }),
      entitlement({
        code: "seat_limit",
        name: "Seat",
        value_type: "numeric_limit",
        unlimited: true,
        usage: 1,
      }),
      entitlement({
        code: "tags_limit",
        name: "Tags",
        value_type: "numeric_limit",
        unlimited: true,
        usage: 0,
      }),
    ]);

    assert.deepEqual(
      rows.map((row) => row.name),
      ["Catalog"],
    );
  });

  it("marks a hard limit when nothing remains", () => {
    const rows = limitUsageRows([
      entitlement({
        code: "offices",
        name: "Offices",
        value_type: "numeric_limit",
        value: "5",
        usage: 5,
        remaining: 0,
      }),
    ]);
    assert.equal(rows[0]?.label, "5 of 5 · Limit reached");
    assert.equal(rows[0]?.atLimit, true);
  });
});
