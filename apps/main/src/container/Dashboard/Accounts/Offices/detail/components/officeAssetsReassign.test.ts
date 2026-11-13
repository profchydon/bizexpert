import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const cardSource = readFileSync(join(dir, "OfficeAssetsCard.tsx"), "utf8");
const bulkBarSource = readFileSync(join(dir, "OfficeBulkBar.tsx"), "utf8");
const bulkActionsSource = readFileSync(
  join(dir, "../../hooks/useOfficeBulkActions.ts"),
  "utf8",
);
const employeesCardSource = readFileSync(
  join(dir, "OfficeEmployeesCard.tsx"),
  "utf8",
);

describe("useOfficeBulkActions reassign guard", () => {
  it("forwards the caller supplied disabled state onto Reassign", () => {
    assert.match(bulkActionsSource, /disabled: reassign\?\.disabled/);
    assert.match(
      bulkActionsSource,
      /disabledReason: reassign\?\.disabledReason/,
    );
  });

  it("does not open the reassign modal when the action is disabled", () => {
    assert.match(bulkActionsSource, /if \(reassign\?\.disabled\) return;/);
  });

  it("keeps employee reassign enabled when no guard is passed", () => {
    assert.doesNotMatch(employeesCardSource, /reassign:\s*\{/);
  });
});

describe("OfficeAssetsCard assigned reassign", () => {
  it("disables reassign when a selected asset is assigned", () => {
    assert.match(cardSource, /hasAssignedOfficeAssets\(selectedAssets\)/);
    assert.match(cardSource, /disabled: hasAssignedSelected/);
    assert.match(cardSource, /REASSIGN_ASSIGNED_ASSET_MESSAGE/);
  });

  it("resolves the selected rows from the current assets page", () => {
    assert.match(
      cardSource,
      /pageRows\.filter\(\(row\) => sel\.selected\.has\(row\.id\)\)/,
    );
  });
});

describe("OfficeBulkBar disabled notice", () => {
  it("shows the disabled reason in the bar and on the button tooltip", () => {
    assert.match(bulkBarSource, /action\.disabled && action\.disabledReason/);
    assert.match(
      bulkBarSource,
      /<p className="basis-full text-xs text-gray-600">\{disabledNotice\}<\/p>/,
    );
    assert.match(bulkBarSource, /\{action\.disabledReason\}/);
  });
});

describe("REASSIGN_ASSIGNED_ASSET_MESSAGE", () => {
  it("tells the user to unassign the employee before moving the asset", () => {
    assert.match(
      bulkActionsSource,
      /REASSIGN_ASSIGNED_ASSET_MESSAGE =\s*\n?\s*"Assigned assets can't be moved to another office/,
    );
  });
});
