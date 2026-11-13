import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("startEntityConsent", () => {
  it("posts to the entity consent start endpoint", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/api/baseQueries/companiesApi/entitiesApi/startEntityConsent.ts",
      ),
      "utf8",
    );

    assert.match(source, /startEntityConsent: mutation\.mutation/);
    assert.match(source, /\/\$\{entityId\}\/consent\/start/);
    assert.match(source, /return_path/);
    assert.match(source, /method: "POST"/);
  });
});
