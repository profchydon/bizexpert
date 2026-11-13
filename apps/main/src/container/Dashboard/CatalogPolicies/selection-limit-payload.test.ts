import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ruleToPolicyPayload } from "./apiAdapters";
import { baseRule } from "./catalog-policy.test-fixtures";
import { ruleToCreateSubRulePayload } from "./subRulePayload";

describe("selection limit payloads", () => {
  it("sends null min and max for no-limit policy selection rows", () => {
    const payload = ruleToPolicyPayload({
      ...baseRule,
      selectionMode: "OPEN",
      selectionLimits: [
        { categoryId: "category-1", category: "Laptop", min: 1, max: null },
      ],
    });

    assert.deepEqual(payload.rule?.selection_config, {
      categories: [{ category_id: "category-1", min: null, max: null }],
    });
  });

  it("sends null min and max for no-limit sub policy category limits", () => {
    const payload = ruleToCreateSubRulePayload({
      ...baseRule,
      selectionMode: "OPEN",
      selectionLimitsOverride: true,
      selectionLimits: [
        { categoryId: "category-1", category: "Display", min: 1, max: null },
      ],
      status: "DRAFT",
    });

    assert.deepEqual(payload.selection_config, {
      categories: [{ category_id: "category-1", min: null, max: null }],
    });
  });
});
