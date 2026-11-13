import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { baseRule, employees } from "./catalog-policy.test-fixtures";
import type { ImpactPreviewRow } from "./types";
import {
  calculateImpact,
  calculateSpecificityScore,
  detectConflicts,
  filterMultiPickOptions,
  filterOptionsByQuery,
  filterRules,
  getImpactPreviewSummary,
  getRuleFilterCount,
  getMissingSubRuleKitIds,
  normalizeMultiPickOptions,
  needsMultiKitFixedWarning,
  removeMultiPickValue,
  shouldShowPolicyDetailLoader,
} from "./utils";

describe("catalog policy matching logic", () => {
  it("scores specificity using country, role, and level weights", () => {
    assert.equal(
      calculateSpecificityScore({
        matchCountries: ["Nigeria"],
        matchRoles: ["Engineer"],
        matchLevels: ["L4"],
      }),
      6,
    );
  });

  it("detects equal-specificity conflicts for overlapping rules", () => {
    const conflicts = detectConflicts(
      baseRule,
      [
        baseRule,
        {
          ...baseRule,
          id: "rule-b",
          name: "Senior Engineers Nigeria",
        },
      ],
      employees,
    );

    assert.equal(conflicts.length, 1);
    assert.equal(conflicts[0].severity, "RED");
    assert.equal(conflicts[0].affectedEmployees[0].name, "Tunde Okafor");
  });

  it("filters rules by status, search, and dimension filters", () => {
    const filtered = filterRules({
      rules: [
        baseRule,
        {
          ...baseRule,
          id: "rule-c",
          name: "Design Team",
          matchRoles: ["Designer"],
          status: "DRAFT",
        },
      ],
      search: "engineering",
      statusFilter: "Active",
      filters: {
        roles: ["Engineer"],
        levels: [],
        departments: [],
        countries: ["Nigeria"],
      },
    });

    assert.deepEqual(
      filtered.map((rule) => rule.id),
      ["rule-a"],
    );
  });

  it("excludes roles from catalog policy filters", () => {
    const filters = {
      roles: ["Designer"],
      levels: [],
      departments: [],
      countries: [],
    };
    const filtered = filterRules({
      rules: [baseRule],
      search: "",
      statusFilter: "All",
      filters,
    });

    assert.deepEqual(
      filtered.map((rule) => rule.id),
      ["rule-a"],
    );
    assert.equal(getRuleFilterCount(filters), 0);
  });

  it("searches filter dropdown options by label", () => {
    const options = [
      { value: "level-1", label: "Executive" },
      { value: "level-2", label: "Management" },
    ];

    assert.deepEqual(filterOptionsByQuery(options, "exec"), [options[0]]);
    assert.deepEqual(filterOptionsByQuery(options, " "), options);
  });

  it("marks higher-specificity coverage as displacement", () => {
    const rows = calculateImpact(
      baseRule,
      [
        {
          ...baseRule,
          id: "rule-low",
          name: "All Engineers",
          matchLevels: [],
          matchCountries: [],
          specificityScore: 2,
        },
      ],
      employees,
    );

    assert.equal(rows.length, 1);
    assert.equal(rows[0].impact, "displacement");
    assert.equal(rows[0].displacedFrom, "All Engineers");
  });

  it("summarizes impacted employee rows", () => {
    const rows: ImpactPreviewRow[] = [
      {
        employeeId: "emp-1",
        employeeName: "Tunde Okafor",
        role: "Engineer",
        level: "L4",
        country: "Nigeria",
        countryCode: "NG",
        currentMatchedBy: null,
        impact: "new_coverage",
      },
      {
        employeeId: "emp-2",
        employeeName: "Sarah Thompson",
        role: "Engineer",
        level: "L4",
        country: "United Kingdom",
        countryCode: "GB",
        currentMatchedBy: "All Engineers",
        impact: "displacement",
        displacedFrom: "All Engineers",
      },
    ];

    assert.deepEqual(getImpactPreviewSummary(rows), {
      matched: 2,
      newlyCovered: 1,
      displaced: 1,
    });
  });

  it("handles multi-kit activation guards", () => {
    assert.equal(
      needsMultiKitFixedWarning({
        selectionMode: "FIXED",
        kitIds: ["kit-1", "kit-2"],
      }),
      true,
    );
    assert.deepEqual(
      getMissingSubRuleKitIds(
        {
          selectionMode: "OPEN",
          kitIds: ["kit-1", "kit-2", "kit-3"],
        },
        [{ kitIds: ["kit-1"] }, { kitIds: ["kit-3"] }],
      ),
      ["kit-2"],
    );
  });

  it("keeps detail content visible during policy refetches", () => {
    assert.equal(
      shouldShowPolicyDetailLoader({
        hasCompanyId: true,
        hasPolicy: true,
        isInitialLoading: false,
      }),
      false,
    );
    assert.equal(
      shouldShowPolicyDetailLoader({
        hasCompanyId: true,
        hasPolicy: true,
        isInitialLoading: true,
      }),
      false,
    );
    assert.equal(
      shouldShowPolicyDetailLoader({
        hasCompanyId: true,
        hasPolicy: false,
        isInitialLoading: true,
      }),
      true,
    );
  });

  it("prefers exact country search matches in add-rule selectors", () => {
    const options = normalizeMultiPickOptions(["Afghanistan", "Ghana"]);

    assert.deepEqual(
      filterMultiPickOptions(options, "ghan").map((option) => option.label),
      ["Ghana"],
    );
    assert.deepEqual(
      removeMultiPickValue(["country-ng", "country-gh"], "country-gh"),
      ["country-ng"],
    );
  });
});
