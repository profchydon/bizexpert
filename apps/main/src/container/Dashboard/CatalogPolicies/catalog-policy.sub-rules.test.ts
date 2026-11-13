import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { baseRule } from "./catalog-policy.test-fixtures";
import {
  createChildRuleDraft,
  describeChildRuleScope,
  getChildRuleLimitViolations,
  getChildRuleSubmitLabel,
  isChildRuleDraftValid,
  isChildRuleReadyToSave,
  isChildRuleSubmitDisabled,
  shouldShowChildRuleCategoryLimits,
} from "./utils";
import { scopedOptions } from "./utilsOptionScope";

describe("catalog policy sub-rule modal logic", () => {
  it("formats match criteria labels instead of ids", () => {
    const draft = {
      ...createChildRuleDraft("child-1", baseRule),
      narrowRoles: ["Sales"],
      narrowLevels: ["level-1"],
      narrowDepartments: ["dept-1"],
      narrowCountries: ["country-gh"],
    };

    assert.equal(
      describeChildRuleScope(draft, {
        levels: [{ value: "level-1", label: "Executive" }],
        departments: [{ value: "dept-1", label: "Engineering" }],
        countries: [{ value: "country-gh", label: "Ghana" }],
      }),
      "Role: Sales · Level: Executive · Dept: Engineering · Country: Ghana",
    );
  });

  it("disables sub-rule submission while saving", () => {
    assert.equal(
      isChildRuleSubmitDisabled({
        canSave: true,
        finalStep: true,
        isSaving: true,
      }),
      true,
    );
    assert.equal(
      getChildRuleSubmitLabel({ finalStep: true, isSaving: true }),
      "Adding...",
    );
  });

  it("labels the final child-rule action as Add sub policy", () => {
    assert.equal(
      getChildRuleSubmitLabel({ finalStep: true, isSaving: false }),
      "Add sub policy",
    );
  });

  it("labels edit child-rule actions as Update sub policy", () => {
    assert.equal(
      getChildRuleSubmitLabel({
        finalStep: true,
        isEditing: true,
        isSaving: false,
      }),
      "Update sub policy",
    );
    assert.equal(
      getChildRuleSubmitLabel({
        finalStep: true,
        isEditing: true,
        isSaving: true,
      }),
      "Updating...",
    );
  });

  it("disables Add sub policy until a name and kit are selected", () => {
    const draft = {
      ...createChildRuleDraft("child-no-kit", baseRule),
      overrideStorage: true,
      overrideKit: false,
      kitIds: [],
    };

    assert.equal(isChildRuleDraftValid(draft), false);
    assert.equal(isChildRuleDraftValid({ ...draft, kitIds: ["kit-1"] }), false);
    assert.equal(
      isChildRuleDraftValid({
        ...draft,
        name: "Executive sub policy",
        kitIds: ["kit-1"],
      }),
      true,
    );
  });

  it("blocks Add sub policy when category limits exceed the parent rule", () => {
    const parent = {
      ...baseRule,
      selectionLimits: [
        { categoryId: "category-1", category: "Imac", min: 0, max: 4 },
      ],
    };
    const draft = {
      ...createChildRuleDraft("child-limit", parent),
      name: "Executive sub policy",
      kitIds: ["kit-1"],
      overrideCategoryLimits: true,
      categoryLimits: [
        { categoryId: "category-1", category: "Imac", min: 0, max: 5 },
      ],
    };

    assert.deepEqual(getChildRuleLimitViolations(draft, parent), [
      { key: "category-1", message: "Max must be up to 4 or less." },
    ]);
    assert.equal(isChildRuleReadyToSave(draft, parent), false);
    assert.equal(
      isChildRuleReadyToSave(
        {
          ...draft,
          categoryLimits: [
            { categoryId: "category-1", category: "Imac", min: 0, max: 4 },
          ],
        },
        parent,
      ),
      true,
    );
  });

  it("blocks Add sub policy when category min exceeds the parent rule min", () => {
    const parent = {
      ...baseRule,
      selectionLimits: [
        { categoryId: "category-1", category: "Imac", min: 0, max: 4 },
      ],
    };
    const draft = {
      ...createChildRuleDraft("child-min-limit", parent),
      name: "Executive sub policy",
      kitIds: ["kit-1"],
      overrideCategoryLimits: true,
      categoryLimits: [
        { categoryId: "category-1", category: "Imac", min: 1, max: 1 },
      ],
    };

    assert.deepEqual(getChildRuleLimitViolations(draft, parent), [
      { key: "category-1", message: "Min must be 0 or less." },
    ]);
    assert.equal(isChildRuleReadyToSave(draft, parent), false);
  });

  it("disables Next until the sub policy name is filled", () => {
    assert.equal(
      isChildRuleSubmitDisabled({
        canSave: false,
        canContinue: false,
        finalStep: false,
        isSaving: false,
      }),
      true,
    );
    assert.equal(
      isChildRuleSubmitDisabled({
        canSave: false,
        canContinue: true,
        finalStep: false,
        isSaving: false,
      }),
      false,
    );
  });

  it("scopes child-rule dropdown options by backend names or ids", () => {
    const options = [
      { value: "level-1", label: "Executive" },
      { value: "level-2", label: "Management" },
      { value: "level-3", label: "Associate" },
    ];

    assert.deepEqual(scopedOptions(options, ["Executive", "level-2"]), [
      { value: "level-1", label: "Executive" },
      { value: "level-2", label: "Management" },
    ]);
  });

  it("only shows sub-rule category limits after selecting a kit", () => {
    assert.equal(
      shouldShowChildRuleCategoryLimits({
        selectionMode: "OPEN",
        overrideKit: true,
        kitIds: [],
      }),
      false,
    );
    assert.equal(
      shouldShowChildRuleCategoryLimits({
        selectionMode: "OPEN",
        overrideKit: true,
        kitIds: ["kit-1"],
      }),
      true,
    );
    assert.equal(
      shouldShowChildRuleCategoryLimits({
        selectionMode: "FIXED",
        overrideKit: true,
        kitIds: ["kit-1"],
      }),
      false,
    );
    assert.equal(
      shouldShowChildRuleCategoryLimits({
        selectionMode: "OPEN",
        overrideKit: false,
        kitIds: ["kit-1"],
      }),
      false,
    );
  });
});
