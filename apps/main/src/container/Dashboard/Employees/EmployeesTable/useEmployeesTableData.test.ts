import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("useEmployeesTableData entity scoping", () => {
  it("scopes both active and archived tabs when an entity workspace is active", () => {
    const source = readFileSync(
      new URL("./useEmployeesTableData.ts", import.meta.url),
      "utf8",
    );

    assert.match(source, /return Boolean\(entityId\)/);
    assert.doesNotMatch(
      source,
      /Boolean\(entityId\) && selectedFilterValue === "active"/,
    );
    assert.match(
      source,
      /useGetArchivedEmployeesQuery\([\s\S]*companyId: \(entityId \?\? companyId\)/,
    );
    assert.match(
      source,
      /skip: !companyId \|\| isActiveTab \|\| useEntityScope/,
    );
  });
});
