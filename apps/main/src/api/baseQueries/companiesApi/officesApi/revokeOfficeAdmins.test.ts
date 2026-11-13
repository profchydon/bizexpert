import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const source = readFileSync(
  join(
    process.cwd(),
    "src/api/baseQueries/companiesApi/officesApi/revokeOfficeAdmins.ts",
  ),
  "utf8",
);

describe("revokeOfficeAdmins", () => {
  it("posts to the office admin revoke route", () => {
    assert.match(source, /offices\/\$\{officeId\}\/admins\/revoke/);
    assert.match(source, /method: "POST"/);
    assert.match(source, /user_id\?: string/);
  });
});
