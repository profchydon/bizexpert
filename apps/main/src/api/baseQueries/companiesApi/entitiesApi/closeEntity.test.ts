import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("closeEntity", () => {
  it("posts to the subsidiary close endpoint", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/api/baseQueries/companiesApi/entitiesApi/closeEntity.ts",
      ),
      "utf8",
    );

    assert.match(source, /closeEntity: build\.mutation/);
    assert.match(source, /url: `\/\$\{entityId\}\/close`/);
    assert.match(source, /method: "POST"/);
    assert.match(source, /"Entities"/);
  });
});
