import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const source = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Accounts/Offices/detail/components/OfficeAdminList.tsx",
  ),
  "utf8",
);

const card = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Accounts/Offices/detail/components/OfficeOverviewCard.tsx",
  ),
  "utf8",
);

describe("OfficeAdminList", () => {
  it("links every admin to its employee detail page", () => {
    assert.match(source, /admins\.map\(/);
    assert.match(source, /href=\{`\$\{routes\.EMPLOYEES\}\/\$\{admin\.id\}`\}/);
    assert.match(source, /from "next\/link"/);
  });

  it("renders a plain chip when the admin has no id", () => {
    assert.match(source, /admin\.id \? \(/);
    assert.match(source, /<span key=\{`\$\{admin\.name\}-\$\{index\}`\}/);
  });

  it("keeps the not-assigned empty state", () => {
    assert.match(source, /if \(!admins\.length\)/);
    assert.match(source, /Not assigned/);
  });

  it("is wired into the office overview card with a name-only fallback", () => {
    assert.match(card, /<OfficeAdminList admins=\{officeAdminRefs\} \/>/);
    assert.match(
      card,
      /office\.officeAdminRefs \?\?\s*office\.officeAdmins\.map\(\(name\) => \(\{ name \}\)\)/,
    );
  });
});
