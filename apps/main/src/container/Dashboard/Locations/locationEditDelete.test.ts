import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  locationDeleteDescription,
  locationDeleteTitle,
} from "./deleteLocationCopy";
import {
  locationsDeleteModalBodyClass,
  locationsDeleteModalContentClass,
  locationsDeleteModalFooterClass,
  locationsDeleteModalTitleClass,
} from "./locationsPageClasses";

const officeDelete = readFileSync(
  "src/container/Dashboard/Accounts/Offices/detail/components/removeOfficeAreaModalClasses.ts",
  "utf8",
);

test("delete location copy names the location", () => {
  assert.equal(locationDeleteTitle(), "Delete location");
  assert.equal(
    locationDeleteDescription("Main shop"),
    "This will remove Main shop from your locations list.",
  );
});

test("delete location modal uses the office remove-area dialog chrome", () => {
  assert.equal(officeDelete.includes(locationsDeleteModalContentClass), true);
  assert.equal(officeDelete.includes(locationsDeleteModalTitleClass), true);
  assert.equal(officeDelete.includes(locationsDeleteModalBodyClass), true);
  assert.equal(officeDelete.includes(locationsDeleteModalFooterClass), true);
});

test("row actions open edit slideout and delete modal", () => {
  const table = readFileSync(
    "src/container/Dashboard/Locations/LocationsTable/index.tsx",
    "utf8",
  );
  const actions = readFileSync(
    "src/container/Dashboard/Locations/LocationsTable/tableActions.tsx",
    "utf8",
  );
  const form = readFileSync(
    "src/container/Dashboard/Locations/CreateLocation.tsx",
    "utf8",
  );
  const modal = readFileSync(
    "src/container/Dashboard/Locations/DeleteLocationModal.tsx",
    "utf8",
  );

  assert.equal(actions.includes("Edit"), true);
  assert.equal(actions.includes("Delete"), true);
  assert.equal(table.includes("onEdit"), true);
  assert.equal(table.includes("DeleteLocationModal"), true);
  assert.equal(form.includes("bizexpertApi.put"), true);
  assert.equal(table.includes("bizexpertApi.delete"), true);
  assert.equal(modal.includes("Dialog"), true);
});
