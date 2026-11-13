import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { SubscriptionEntitlement } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContract";
import type { ComparisonGroup } from "./catalog";
import {
  countedLimit,
  downgradeBlocks,
  featureOn,
  officeLimitLabel,
} from "./entitlementAccess";

function row(
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

const groups: ComparisonGroup[] = [
  {
    key: "organisation_limits",
    name: "Organisation limits",
    features: [
      {
        code: "offices",
        name: "Offices",
        cells: [
          { plan: "procure", kind: "value", label: "1" },
          { plan: "manage", kind: "value", label: "5" },
          { plan: "operate", kind: "value", label: "10" },
          { plan: "scale", kind: "value", label: "Unlimited" },
        ],
      },
      {
        code: "tags",
        name: "Tags",
        cells: [
          { plan: "procure", kind: "excluded", label: null },
          { plan: "manage", kind: "value", label: "Unlimited" },
          { plan: "scale", kind: "value", label: "Unlimited" },
        ],
      },
    ],
  },
];

describe("entitlement access", () => {
  it("treats a boolean with no remaining as on when it is allowed", () => {
    const asset = row({
      code: "asset_detail",
      value_type: "boolean",
      value: "true",
      remaining: 0,
    });
    assert.equal(featureOn(asset), true);
    assert.equal(countedLimit(asset), null);
  });

  it("keeps an unlimited office row off the hard block", () => {
    const offices = row({
      code: "office_limit",
      value_type: "numeric_limit",
      value: "unlimited",
      unlimited: true,
      usage: 14,
      remaining: null,
    });
    assert.equal(countedLimit(offices)?.atLimit, false);
    assert.equal(officeLimitLabel(offices), "Unlimited offices");
  });

  it("marks Resolve as reached when nothing remains", () => {
    const resolve = countedLimit(
      row({
        code: "resolve_actions",
        value_type: "metered",
        value: "500",
        usage: 500,
        remaining: 0,
      }),
    );
    assert.equal(resolve?.atLimit, true);
    assert.equal(resolve?.softWarning, true);
  });

  it("names the offices and tags a downgrade has to clear", () => {
    const items = [
      row({
        code: "office_limit",
        value_type: "numeric_limit",
        value: "unlimited",
        unlimited: true,
        usage: 14,
      }),
      row({
        code: "tags_limit",
        value_type: "numeric_limit",
        value: "unlimited",
        unlimited: true,
        usage: 2,
      }),
    ];
    assert.deepEqual(downgradeBlocks(items, groups, "manage"), [
      "You are using 14 offices. Bring that down to 5 or fewer before switching.",
    ]);
    assert.deepEqual(downgradeBlocks(items, groups, "procure"), [
      "You are using 14 offices. Bring that down to 1 or fewer before switching.",
      "Remove all 2 tags before switching.",
    ]);
    assert.deepEqual(downgradeBlocks(items, groups, "scale"), []);
  });
});
