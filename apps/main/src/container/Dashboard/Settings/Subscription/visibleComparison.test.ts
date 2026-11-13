import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ComparisonGroup } from "./catalog";
import { comparisonRowCount } from "./subscriptionView";
import { visibleComparisonGroups } from "./visibleComparison";

const groups: ComparisonGroup[] = [
  {
    key: "limits",
    name: "Organisational limits",
    features: [
      {
        code: "offices",
        name: "Offices",
        cells: [{ plan: "procure", kind: "value", label: "1" }],
      },
      {
        code: "byod_support",
        name: "BYOD support",
        cells: [{ plan: "procure", kind: "excluded", label: null }],
      },
      {
        code: "tags",
        name: "Tags",
        cells: [{ plan: "procure", kind: "value", label: "Unlimited" }],
      },
    ],
  },
  {
    key: "compliance",
    name: "Compliance and policy",
    features: [
      {
        code: "it_compliance_engine",
        name: "IT Compliance Engine (SOC 2, ISO 27001)",
        cells: [{ plan: "procure", kind: "excluded", label: null }],
      },
      {
        code: "grc_integrations",
        name: "GRC integrations (Vanta, Drata, Oneleet, CompAI)",
        cells: [{ plan: "procure", kind: "excluded", label: null }],
      },
      {
        code: "it_policy_management",
        name: "IT Policy Management",
        cells: [{ plan: "procure", kind: "excluded", label: null }],
      },
      {
        code: "hris_integrations",
        name: "15+ HRIS integrations",
        cells: [{ plan: "procure", kind: "included", label: null }],
      },
      {
        code: "accounting_sync",
        name: "Accounting sync (Xero, QuickBooks, Sage)",
        cells: [{ plan: "procure", kind: "excluded", label: null }],
      },
      {
        code: "mdm_integrations",
        name: "MDM integrations (Jamf, Intune, Kandji)",
        cells: [{ plan: "procure", kind: "included", label: null }],
      },
    ],
  },
  {
    key: "fleet",
    name: "Fleet intelligence",
    features: [
      {
        code: "wifi_den",
        name: "WiFi Den (shadow IT and network discovery)",
        cells: [],
      },
    ],
  },
  {
    key: "it-ops",
    name: "IT operations / AI",
    features: [
      {
        code: "rayda_resolve",
        name: "Rayda Resolve (AI IT support, actions per month)",
        cells: [],
      },
    ],
  },
];

describe("visible comparison groups", () => {
  it("keeps only 15+ HRIS integrations in compliance and policy", () => {
    const visible = visibleComparisonGroups(groups);
    const compliance = visible.find(
      (group) => group.name === "Compliance and policy",
    );
    assert.deepEqual(
      compliance?.features.map((feature) => feature.name),
      ["15+ HRIS integrations"],
    );
    assert.deepEqual(
      visible[0]?.features.map((feature) => feature.name),
      ["Offices"],
    );
    assert.deepEqual(
      visible.map((group) => group.name),
      ["Organisational limits", "Compliance and policy"],
    );
    assert.equal(comparisonRowCount({ plans: [], groups: visible }), 2);
  });

  it("drops the compliance group when HRIS is absent", () => {
    const visible = visibleComparisonGroups([
      {
        key: "compliance",
        name: "Compliance and policy",
        features: [
          {
            code: "it_policy_management",
            name: "IT Policy Management",
            cells: [],
          },
        ],
      },
    ]);
    assert.equal(visible.length, 0);
  });
});
