import assert from "node:assert/strict";
import test from "node:test";
import type { Office } from "../../types";
import { filterOffices, sortOffices, toggleOfficeSort } from "./sortOffices";

const offices: Office[] = [
  {
    id: "1",
    name: "United States office 2",
    subsidiaryId: "s1",
    subsidiaryName: "Acme Inc",
    region: "United States",
    type: "Remote",
    currency: "USD",
    officeAdmins: [],
    status: "active",
  },
  {
    id: "2",
    name: "United States office 1",
    subsidiaryId: "s1",
    subsidiaryName: "Acme Inc",
    region: "United States",
    type: "Physical",
    currency: "USD",
    officeAdmins: [],
    status: "active",
    isPrimary: true,
  },
];

test("filterOffices matches name, entity, and region", () => {
  assert.equal(filterOffices(offices, "office 1", []).length, 1);
  assert.equal(filterOffices(offices, "acme", []).length, 2);
  assert.equal(filterOffices(offices, "", ["Physical"]).length, 1);
});

test("sortOffices sorts by name ascending and descending", () => {
  const asc = sortOffices(offices, { column: "name", direction: "asc" });
  assert.equal(asc[0]?.name, "United States office 1");
  const desc = sortOffices(offices, { column: "name", direction: "desc" });
  assert.equal(desc[0]?.name, "United States office 2");
});

test("toggleOfficeSort flips direction on the same column", () => {
  const first = toggleOfficeSort({ column: "", direction: "asc" }, "name");
  assert.deepEqual(first, { column: "name", direction: "asc" });
  const second = toggleOfficeSort(first, "name");
  assert.deepEqual(second, { column: "name", direction: "desc" });
});
