import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const header = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Accounts/Offices/components/OfficeDetailHeader.tsx",
  ),
  "utf8",
);
const page = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Accounts/Offices/OfficeDetailPage.tsx",
  ),
  "utf8",
);

describe("OfficeDetailHeader", () => {
  it("makes Buy for this office the primary action", () => {
    assert.match(header, /Buy for this office/);
    assert.match(header, /variant="primary"/);
    assert.match(header, /accountsDetailPrimaryButtonClass/);
  });

  it("offers manage admins beside edit", () => {
    assert.match(header, /Manage admins/);
    assert.match(header, /onManageAdmins/);
    assert.match(
      page,
      /onManageAdmins=\{\(\) => admins\.setManageOpen\(true\)\}/,
    );
    assert.match(page, /<ManageAdminsSlideout/);
    assert.match(page, /<RevokeAdminModal/);
  });
});
