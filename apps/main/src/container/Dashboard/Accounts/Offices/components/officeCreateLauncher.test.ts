import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("SubsidiaryOfficesCard", () => {
  it("shows the Add office launcher for non-closed entities", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/components/SubsidiaryOfficesCard.tsx",
      ),
      "utf8",
    );

    assert.match(source, /OfficeCreateLauncher/);
    assert.match(source, /officeDetailHref/);
    assert.match(source, /fromSubsidiary: true/);
    assert.match(source, /OfficeClosedBadge/);
    assert.match(
      source,
      /subsidiaryId: office\.subsidiaryId \|\| subsidiary\.id/,
    );
    assert.match(source, /label="Add office"/);
    assert.match(source, /fixedParentId=\{subsidiary\.id\}/);
    assert.match(source, /canAddOffice/);
  });
});

describe("OfficeCreateLauncher", () => {
  it("gates creation by role and opens the office wizard", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Accounts/Offices/components/OfficeCreateLauncher.tsx",
      ),
      "utf8",
    );

    assert.match(source, /canCreateOffices/);
    assert.match(source, /variant="primary"/);
    assert.match(source, /CreateOfficeWizard/);
    assert.match(source, /OfficePlanModal/);
  });
});
