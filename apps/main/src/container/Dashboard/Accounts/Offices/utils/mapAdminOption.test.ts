import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyAdminCountryScope,
  mergeAdminOptions,
  toOfficeAdminOption,
} from "./mapAdminOption";

describe("toOfficeAdminOption", () => {
  it("maps a company user with country name and code", () => {
    const option = toOfficeAdminOption({
      id: "user-1",
      first_name: "Joe",
      last_name: "Andy",
      country: { name: "United States", code: "US" },
    });

    assert.deepEqual(option, {
      value: "user-1",
      label: "Joe Andy",
      country: "United States",
      countryCode: "US",
    });
  });

  it("maps an employee whose country is a string plus country_code", () => {
    const option = toOfficeAdminOption({
      id: "user-4",
      first_name: "Chioma",
      last_name: "Okeke",
      country: "Germany",
      country_code: "DE",
    });

    assert.deepEqual(option, {
      value: "user-4",
      label: "Chioma Okeke",
      country: "Germany",
      countryCode: "DE",
    });
  });

  it("keeps the email so a pending invite can match the row", () => {
    const option = toOfficeAdminOption({
      id: "user-5",
      first_name: "James",
      last_name: "Moore",
      email: "james.moore@yopmail.com",
    });

    assert.equal(option.email, "james.moore@yopmail.com");
  });

  it("omits country fields when the server returns nulls", () => {
    const option = toOfficeAdminOption({
      id: "user-2",
      first_name: "Dahlia",
      last_name: "Schiller",
      country: { name: null, code: null },
    });

    assert.equal(option.country, undefined);
    assert.equal(option.countryCode, undefined);

    const noCountry = toOfficeAdminOption({
      id: "user-3",
      first_name: "Hollis",
      last_name: "Lakin",
    });
    assert.equal(noCountry.country, undefined);
    assert.equal(noCountry.countryCode, undefined);
  });
});

describe("applyAdminCountryScope", () => {
  const uk = { value: "user-1", label: "Tunji Ade", country: "United Kingdom" };
  const ng = {
    value: "user-2",
    label: "Bimpe Jacobs",
    country: "Nigeria",
  };

  it("returns every option when country filtering is off", () => {
    assert.deepEqual(applyAdminCountryScope([uk, ng], null, false), [uk, ng]);
    assert.deepEqual(applyAdminCountryScope([uk, ng], "Nigeria", false), [
      uk,
      ng,
    ]);
  });

  it("still scopes by country when filtering is on", () => {
    assert.deepEqual(applyAdminCountryScope([uk, ng], "Nigeria", true), [ng]);
    assert.deepEqual(applyAdminCountryScope([uk, ng], null, true), []);
  });
});

describe("mergeAdminOptions", () => {
  const a = { value: "a", label: "Ada" };
  const b = { value: "b", label: "Ben" };
  const c = { value: "c", label: "Cal" };

  it("appends later pages without duplicates", () => {
    const merged = mergeAdminOptions([a, b], [b, c], 2);
    assert.deepEqual(
      merged.map((option) => option.value),
      ["a", "b", "c"],
    );
  });

  it("resets the list when page one arrives (new search)", () => {
    const merged = mergeAdminOptions([a, b], [c], 1);
    assert.deepEqual(
      merged.map((option) => option.value),
      ["c"],
    );
  });
});
