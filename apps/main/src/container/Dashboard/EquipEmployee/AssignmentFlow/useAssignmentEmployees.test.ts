import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const source = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/EquipEmployee/AssignmentFlow/useAssignmentEmployees.ts",
  ),
  "utf8",
);

describe("useAssignmentEmployees fetch effect", () => {
  it("does not depend on the carts array identity", () => {
    assert.match(source, /}, \[companyId, countriesKey, reloadKey\]\);/);
    assert.doesNotMatch(source, /fetchEmployees,/);
    assert.doesNotMatch(
      source,
      /\[companyId,\s*countriesKey,\s*reloadKey,\s*fetchEmployees,\s*carts/,
    );
  });

  it("reads carts and the lazy query trigger from refs", () => {
    assert.match(source, /const cartsRef = useRef\(carts\);/);
    assert.match(source, /cartsRef\.current = carts;/);
    assert.match(source, /const fetchEmployeesRef = useRef\(fetchEmployees\);/);
    assert.match(source, /fetchEmployeesRef\.current = fetchEmployees;/);
    assert.match(
      source,
      /fetchEmployeesForCountry = fetchEmployeesRef\.current/,
    );
    assert.match(source, /fetchEmployeesForCountry\(/);
    assert.match(source, /buildAssignmentCountries\(\s*cartsRef\.current/);
  });

  it("keys employee reloads on a stable countries key", () => {
    assert.match(
      source,
      /buildAssignmentCountriesKey\(carts, fallbackCountry\)/,
    );
    assert.match(source, /if \(!companyId \|\| !countriesKey\)/);
  });
});
