import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { IEmployees } from "@/types/employees";
import {
  buildEquipCheckout,
  buildEquipCheckoutEmployees,
} from "./buildEquipCheckout";
import type { EquipReviewEmployee } from "./equipTypes";
import type { CountryOption } from "./resolveEmployeeCountryId";
import { item } from "./equipCheckout.fixtures";

describe("buildEquipCheckoutEmployees", () => {
  const full: IEmployees = {
    id: "e1",
    first_name: "Ada",
    last_name: "Lovelace",
    country: "Nigeria",
    country_id: "stale-id",
  } as unknown as IEmployees;

  const review: EquipReviewEmployee[] = [
    { id: "e1", name: "Ada Lovelace", devices: [item()] },
    { id: "e2", name: "No Match", devices: [item({ lineId: "line-2" })] },
  ];

  it("attaches cart items and the resolved country id to matched employees", () => {
    const result = buildEquipCheckoutEmployees(
      review,
      new Map([["e1", full]]),
      { e1: { id: "country-1" }, e2: { id: "country-2" } },
    );

    assert.equal(result.length, 1);
    assert.equal(result[0].id, "e1");
    assert.equal(result[0].country_id, "country-1");
    assert.equal(result[0].items?.length, 1);
    assert.equal(result[0].items?.[0].pricing.country_id, "country-1");
  });

  it("falls back to the employee's country id when none is resolved", () => {
    const result = buildEquipCheckoutEmployees(
      [{ id: "e1", name: "Ada Lovelace", devices: [item()] }],
      new Map([["e1", full]]),
      { e1: undefined },
    );

    assert.equal(result[0].country_id, "stale-id");
  });
});

describe("buildEquipCheckout", () => {
  const full: IEmployees = {
    id: "e1",
    first_name: "Ada",
    last_name: "Lovelace",
    country: "Nigeria",
    country_id: "stale-id",
  } as unknown as IEmployees;

  const countries: CountryOption[] = [
    { id: "ng-id", name: "Nigeria", code: "NG" },
    { id: "uk-id", name: "United Kingdom", code: "GB" },
  ];

  it("resolves the country id from the countries list before assembling carts", () => {
    const result = buildEquipCheckout(
      [{ id: "e1", name: "Ada Lovelace", devices: [item()] }],
      [full],
      countries,
    );

    assert.equal(result.length, 1);
    assert.equal(result[0].country_id, "ng-id");
    assert.equal(result[0].items?.[0].pricing.country_id, "ng-id");
    assert.deepEqual(result[0].items?.[0].country, {
      id: "ng-id",
      code: "NG",
      name: "Nigeria",
    });
  });

  it("attaches each employee's own country to their cart lines", () => {
    const ukEmployee: IEmployees = {
      id: "e9",
      first_name: "Kingdom",
      last_name: "Two",
      country: "United Kingdom",
      country_id: "stale-id",
    } as unknown as IEmployees;

    const result = buildEquipCheckout(
      [{ id: "e9", name: "Kingdom Two", devices: [item()] }],
      [ukEmployee],
      countries,
    );

    assert.equal(result[0].country_id, "uk-id");
    assert.deepEqual(result[0].items?.[0].country, {
      id: "uk-id",
      code: "GB",
      name: "United Kingdom",
    });
  });

  it("drops employees that have no matching full record or devices", () => {
    const result = buildEquipCheckout(
      [
        { id: "e1", name: "Ada Lovelace", devices: [] },
        { id: "e2", name: "Missing", devices: [item()] },
      ],
      [full],
      countries,
    );

    assert.equal(result.length, 0);
  });
});
