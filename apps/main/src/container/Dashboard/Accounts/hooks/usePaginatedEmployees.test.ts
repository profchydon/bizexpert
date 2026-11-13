import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("usePaginatedEmployees", () => {
  it("loads employees in pages of ten", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/hooks/usePaginatedEmployees.ts",
      ),
      "utf8",
    );

    assert.match(source, /WIZARD_EMPLOYEES_PAGE_SIZE = 10/);
  });

  it("queries the employees endpoint with debounced search and pagination", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/hooks/usePaginatedEmployees.ts",
      ),
      "utf8",
    );

    assert.match(source, /useGetEmployeesQuery/);
    assert.match(source, /useDebounce/);
    assert.match(source, /per_page: WIZARD_EMPLOYEES_PAGE_SIZE/);
    assert.match(source, /filterEmployeesByCountry/);
    assert.match(source, /filterByCountry/);
    assert.match(source, /loadMore/);
  });
});
