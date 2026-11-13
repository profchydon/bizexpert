import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("replaceEntityConsent", () => {
  it("posts to the entity consent replace endpoint", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/api/baseQueries/companiesApi/entitiesApi/replaceEntityConsent.ts",
      ),
      "utf8",
    );

    assert.match(source, /replaceEntityConsent: mutation\.mutation/);
    assert.match(source, /\/\$\{entityId\}\/consent\/replace/);
    assert.match(source, /StartEntityConsentRequest/);
    assert.match(source, /method: "POST"/);
  });
});
