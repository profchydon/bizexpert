import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("entity admin invitation API", () => {
  it("loads invitations publicly by code", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/api/baseQueries/companiesApi/entitiesApi/getEntityAdminInvitation.ts",
      ),
      "utf8",
    );

    assert.match(source, /admin-invitations\/\$\{code\}/);
    assert.match(source, /skipAuth: true/);
  });

  it("accepts invitations publicly by code", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/api/baseQueries/companiesApi/entitiesApi/acceptEntityAdminInvitation.ts",
      ),
      "utf8",
    );

    assert.match(source, /admin-invitations\/\$\{code\}\/accept/);
    assert.match(source, /method: "POST"/);
    assert.match(source, /skipAuth: true/);
  });
});
