import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ServerOffice } from "@/types/offices";
import {
  buildEquipmentOfficeItems,
  selectOfficesForCompany,
} from "./equipmentOfficeOptions.ts";

const office = (fields: Partial<ServerOffice>) =>
  ({ id: "office-1", name: "Lagos Office", ...fields }) as ServerOffice;

describe("equipmentOfficeOptions", () => {
  it("maps offices to combobox items with a country and state subtitle", () => {
    const items = buildEquipmentOfficeItems([
      office({
        id: "1",
        name: "Lagos Office",
        country: "Nigeria",
        state: "Lagos",
      }),
    ]);

    assert.deepEqual(items, [
      { id: "1", label: "Lagos Office", supportingText: "Nigeria, Lagos" },
    ]);
  });

  it("omits missing location parts instead of rendering empty separators", () => {
    assert.deepEqual(
      buildEquipmentOfficeItems([
        office({ country: "Nigeria", state: null }),
        office({ id: "2", name: "Remote", country: null, state: null }),
      ]),
      [
        { id: "office-1", label: "Lagos Office", supportingText: "Nigeria" },
        { id: "2", label: "Remote", supportingText: "" },
      ],
    );
  });

  it("returns no items when offices have not loaded", () => {
    assert.deepEqual(buildEquipmentOfficeItems(undefined), []);
  });
});

describe("selectOfficesForCompany", () => {
  const parentOffice = office({ id: "parent-office", company_id: "parent" });
  const subsidiaryOffice = office({ id: "sub-office", company_id: "entity-a" });

  it("keeps only offices the request company owns", () => {
    assert.deepEqual(
      selectOfficesForCompany([parentOffice, subsidiaryOffice], "parent"),
      [parentOffice],
    );
  });

  it("returns the entity's own offices when scoped to that entity", () => {
    assert.deepEqual(
      selectOfficesForCompany([parentOffice, subsidiaryOffice], "entity-a"),
      [subsidiaryOffice],
    );
  });

  it("falls back to the entity id when company_id is absent", () => {
    const inherited = office({
      id: "inherited",
      company_id: undefined as unknown as string,
      entity: { id: "entity-b", name: "Entity B" },
    });

    assert.deepEqual(selectOfficesForCompany([inherited], "entity-b"), [
      inherited,
    ]);
  });

  it("drops every office when the workspace company is unknown", () => {
    assert.deepEqual(
      selectOfficesForCompany([parentOffice, subsidiaryOffice], undefined),
      [],
    );
  });

  it("returns nothing when offices have not loaded", () => {
    assert.deepEqual(selectOfficesForCompany(undefined, "parent"), []);
  });
});
