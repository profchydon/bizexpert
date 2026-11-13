import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("confirmEntityConsent", () => {
  it("posts to the entity consent confirm endpoint", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/api/baseQueries/companiesApi/entitiesApi/confirmEntityConsent.ts",
      ),
      "utf8",
    );

    assert.match(source, /confirmEntityConsent: mutation\.mutation/);
    assert.match(source, /\/\$\{entityId\}\/consent\/confirm/);
    assert.match(source, /method: "POST"/);
    assert.match(source, /invalidatesTags/);
  });
});
