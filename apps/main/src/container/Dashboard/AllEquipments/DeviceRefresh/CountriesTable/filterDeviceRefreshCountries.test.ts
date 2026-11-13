import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { filterDeviceRefreshCountries } from "./filterDeviceRefreshCountries";

const countries = [
  {
    country_id: "c-1",
    country_name: "United Kingdom",
    country_code: "GB",
    overdue_count: 4,
  },
  {
    country_id: "c-2",
    country_name: "Nigeria",
    country_code: "NG",
    overdue_count: 2,
  },
];

describe("filterDeviceRefreshCountries", () => {
  it("returns all countries when search is empty", () => {
    assert.deepEqual(filterDeviceRefreshCountries(countries, ""), countries);
    assert.deepEqual(filterDeviceRefreshCountries(countries, "   "), countries);
  });

  it("matches country name case-insensitively", () => {
    assert.deepEqual(filterDeviceRefreshCountries(countries, "united"), [
      countries[0],
    ]);
  });

  it("matches country code exactly", () => {
    assert.deepEqual(filterDeviceRefreshCountries(countries, "ng"), [
      countries[1],
    ]);
    assert.deepEqual(filterDeviceRefreshCountries(countries, "gb"), [
      countries[0],
    ]);
  });

  it("returns an empty list when nothing matches", () => {
    assert.deepEqual(filterDeviceRefreshCountries(countries, "canada"), []);
  });
});
