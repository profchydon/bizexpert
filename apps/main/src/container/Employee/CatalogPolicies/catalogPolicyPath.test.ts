import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getEmployeeCatalogPolicyIdFromPathname } from "./catalogPolicyPath";

describe("employee catalog policy path helpers", () => {
  it("extracts catalog policy ids only from employee catalog policy detail paths", () => {
    assert.equal(
      getEmployeeCatalogPolicyIdFromPathname(
        "/employee/catalog-policies/policy-1",
      ),
      "policy-1",
    );
    assert.equal(
      getEmployeeCatalogPolicyIdFromPathname(
        "/dashboard/catalog-policies/rules/policy-1",
      ),
      "",
    );
    assert.equal(getEmployeeCatalogPolicyIdFromPathname("/dashboard"), "");
  });
});
