import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  locationsStaffModalBodyClass,
  locationsStaffModalContentClass,
  locationsStaffModalDescriptionClass,
  locationsStaffModalHeaderClass,
  locationsStaffModalTitleClass,
} from "./locationsPageClasses";

const officeModal = readFileSync(
  "src/container/Dashboard/Accounts/components/editSubsidiaryModalClasses.ts",
  "utf8",
);

test("staff modal uses the same dialog chrome as office modals", () => {
  assert.equal(officeModal.includes(locationsStaffModalContentClass), true);
  assert.equal(officeModal.includes(locationsStaffModalHeaderClass), true);
  assert.equal(officeModal.includes(locationsStaffModalTitleClass), true);
  assert.equal(officeModal.includes(locationsStaffModalDescriptionClass), true);
  assert.equal(officeModal.includes(locationsStaffModalBodyClass), true);
});

test("manage staff opens a dialog modal instead of an inline panel", () => {
  const table = readFileSync(
    "src/container/Dashboard/Locations/LocationsTable/index.tsx",
    "utf8",
  );
  const actions = readFileSync(
    "src/container/Dashboard/Locations/LocationsTable/tableActions.tsx",
    "utf8",
  );
  const modal = readFileSync(
    "src/container/Dashboard/Locations/LocationStaffModal.tsx",
    "utf8",
  );

  assert.equal(table.includes("LocationStaffModal"), true);
  assert.equal(table.includes("LocationStaffPanel"), false);
  assert.equal(actions.includes("Manage staff"), true);
  assert.equal(actions.includes("Hide staff"), false);
  assert.equal(modal.includes("Dialog"), true);
  assert.equal(modal.includes("DialogContent"), true);
  assert.equal(modal.includes("LocationStaffPanel"), true);
});
