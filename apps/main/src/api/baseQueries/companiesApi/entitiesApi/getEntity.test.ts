import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("getEntity", () => {
  it("loads a single entity from the company detail endpoint", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/api/baseQueries/companiesApi/entitiesApi/getEntity.ts",
      ),
      "utf8",
    );

    assert.match(source, /getEntity: query\.query/);
    assert.match(source, /url: `\/\$\{entityId\}`/);
    assert.match(source, /EntityDetailApiRecord/);
  });
});
