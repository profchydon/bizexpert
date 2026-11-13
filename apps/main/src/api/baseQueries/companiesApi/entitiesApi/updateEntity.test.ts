import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("updateEntity", () => {
  it("updates a subsidiary via PUT /companies/{entityId}", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/api/baseQueries/companiesApi/entitiesApi/updateEntity.ts",
      ),
      "utf8",
    );

    assert.match(source, /updateEntity: build\.mutation/);
    assert.match(source, /url: `\/\$\{entityId\}`/);
    assert.match(source, /method: "PUT"/);
    assert.match(source, /EntityDetailApiRecord/);
  });
});
