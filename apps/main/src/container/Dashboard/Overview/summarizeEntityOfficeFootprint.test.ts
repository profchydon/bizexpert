import assert from "node:assert/strict";
import { test } from "node:test";
import type { ServerOffice } from "@/types/offices";
import {
  pickCountryStorageCount,
  summarizeEntityOfficeFootprint,
} from "./summarizeEntityOfficeFootprint";

const office = (
  overrides: Partial<ServerOffice> & Pick<ServerOffice, "id" | "name">,
): ServerOffice =>
  ({
    company_id: "co-1",
    street_address: null,
    country: "GB",
    state: null,
    currency_code: "GBP",
    currency_inherited: true,
    type: "physical",
    status: "active",
    is_primary: false,
    entity: null,
    areas: [],
    created_at: "",
    updated_at: "",
    ...overrides,
  }) as ServerOffice;

test("summarizeEntityOfficeFootprint counts live offices, types, and areas", () => {
  const summary = summarizeEntityOfficeFootprint([
    office({
      id: "o1",
      name: "London",
      type: "physical",
      areas: [{ id: "a1", name: "Floor 1", asset_count: 4 }],
    }),
    office({
      id: "o2",
      name: "Remote UK",
      type: "remote",
      areas: [{ id: "a2", name: "Floor 1", asset_count: 1 }],
    }),
    office({ id: "o3", name: "Closed", status: "closed", type: "physical" }),
  ]);

  assert.deepEqual(summary, {
    total: 2,
    physical: 1,
    remote: 1,
    areas: [{ name: "Floor 1", count: 5 }],
  });
});

test("pickCountryStorageCount matches country name or code", () => {
  const rows = [
    {
      country_id: "1",
      country_code: "GB",
      country: "United Kingdom",
      employee_count: 1,
      equipment_count: 2,
      equipment_in_storage_count: 7,
      catalog_count: 0,
    },
  ];

  assert.equal(pickCountryStorageCount(rows, "United Kingdom", "US"), 7);
  assert.equal(pickCountryStorageCount(rows, "Kenya", "GB"), 7);
  assert.equal(pickCountryStorageCount(rows, "Kenya", "KE"), 0);
});
