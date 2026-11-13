import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  officeAreaActionButtonClass,
  officeAreaDeleteButtonClass,
} from "./officeAreasCardClasses";

const dir = dirname(fileURLToPath(import.meta.url));
const cardSource = readFileSync(join(dir, "OfficeAreasCard.tsx"), "utf8");
const rowSource = readFileSync(join(dir, "OfficeAreaRow.tsx"), "utf8");
const modalSource = readFileSync(
  join(dir, "RemoveOfficeAreaModal.tsx"),
  "utf8",
);
const endpointSource = readFileSync(
  join(
    dir,
    "../../../../../../api/baseQueries/companiesApi/officesApi/officeAreas.ts",
  ),
  "utf8",
);

describe("officeAreaActionButtonClass", () => {
  it("uses the light tertiary icon colors from the reference", () => {
    assert.match(officeAreaActionButtonClass, /text-gray-400/);
    assert.match(officeAreaActionButtonClass, /hover:text-gray-500/);
    assert.match(officeAreaActionButtonClass, /hover:bg-gray-50/);
    assert.doesNotMatch(officeAreaActionButtonClass, /text-gray-[6-9]00/);
  });

  it("marks the remove action with the error hover treatment", () => {
    assert.match(officeAreaDeleteButtonClass, /hover:bg-error-50/);
    assert.match(officeAreaDeleteButtonClass, /hover:text-error-600/);
  });
});

describe("deleteOfficeArea endpoint", () => {
  it("calls DELETE on the entity-scoped area path", () => {
    assert.match(endpointSource, /deleteOfficeArea: build\.mutation/);
    assert.match(
      endpointSource,
      /url: `\/\$\{companyId\}\/offices\/\$\{officeId\}\/areas\/\$\{areaId\}`,\s*\n\s*method: "DELETE"/,
    );
    assert.match(endpointSource, /useDeleteOfficeAreaMutation/);
  });

  it("refreshes the office, offices list and equipment caches", () => {
    const invalidations = endpointSource.slice(
      endpointSource.indexOf("deleteOfficeArea"),
    );
    assert.match(invalidations, /\{ type: "Office", id: officeId \}/);
    assert.match(invalidations, /"Offices"/);
    assert.match(invalidations, /"Equipment"/);
  });
});

describe("OfficeAreasCard remove flow", () => {
  it("removes through the mutation scoped to the owning entity", () => {
    assert.match(cardSource, /useDeleteOfficeAreaMutation/);
    assert.match(cardSource, /const companyId = office\.subsidiaryId/);
    assert.match(
      cardSource,
      /await removeArea\(\{\s*companyId,\s*officeId: office\.id,\s*areaId: id,\s*\}\)\.unwrap\(\)/,
    );
  });

  it("never calls the endpoint for an area that still holds assets", () => {
    assert.match(cardSource, /if \(\(asset_count \?\? 0\) > 0\) return;/);
    assert.ok(
      cardSource.indexOf("asset_count") <
        cardSource.indexOf("await removeArea"),
    );
  });

  it("confirms through the modal and notifies on both outcomes", () => {
    assert.match(cardSource, /<RemoveOfficeAreaModal/);
    assert.match(cardSource, /onRemove=\{\(\) => setAreaToRemove\(area\)\}/);
    assert.match(cardSource, /onNotify\("Area removed"/);
    assert.match(cardSource, /officeApiErrorMessage\(error, `Could not remove/);
  });

  it("scopes the row spinner to the area being removed", () => {
    assert.match(
      cardSource,
      /removeResult\.isLoading && areaToRemove\?\.id === area\.id/,
    );
  });

  it("no longer disables removal behind an unavailable tooltip", () => {
    assert.doesNotMatch(cardSource, /AREA_REMOVE_UNAVAILABLE_MESSAGE/);
    assert.doesNotMatch(rowSource, /disabled/);
  });
});

describe("RemoveOfficeAreaModal", () => {
  it("swaps icon and tone between the blocked and destructive states", () => {
    assert.match(modalSource, /blocked \? AlertTriangle : Trash2/);
    assert.match(modalSource, /blocked \? "warning" : "error"/);
  });

  it("offers only a dismiss button while assets block the removal", () => {
    const blockedBranch = modalSource.slice(
      modalSource.indexOf("{blocked ? ("),
      modalSource.indexOf(") : ("),
    );
    assert.match(blockedBranch, /Got it/);
    assert.match(blockedBranch, /onClick=\{onClose\}/);
    assert.doesNotMatch(blockedBranch, /onConfirm/);
  });

  it("confirms an empty area with a destructive button", () => {
    assert.match(modalSource, /variant="destructive"/);
    assert.match(modalSource, /Remove area/);
    assert.match(modalSource, /isLoading=\{isRemoving\}/);
  });

  it("holds the last area through the close animation so the blocked state does not flash the destructive one", () => {
    assert.match(modalSource, /if \(area\) setLastArea\(area\);/);
    assert.match(modalSource, /const shownArea = area \?\? lastArea;/);
    assert.match(modalSource, /shownArea\?\.name \?\? ""/);
    assert.match(modalSource, /shownArea\?\.asset_count \?\? 0/);
    assert.doesNotMatch(modalSource, /buildOfficeAreaRemoveCopy\(\s*area\?\./);
  });
});
