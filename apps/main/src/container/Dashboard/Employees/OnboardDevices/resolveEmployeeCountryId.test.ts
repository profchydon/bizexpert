import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  resolveEmployeeCountryId,
  type CountryOption,
} from "./resolveEmployeeCountryId";

const countries: CountryOption[] = [
  { id: "ng-id", name: "Nigeria", code: "NG" },
  { id: "gb-id", name: "United Kingdom", code: "GB" },
  { id: "us-id", name: "United States", code: "US" },
];

describe("resolveEmployeeCountryId", () => {
  it("matches by country code", () => {
    assert.equal(
      resolveEmployeeCountryId(
        { country: "Nigeria", country_code: "NG" },
        countries,
      ),
      "ng-id",
    );
  });

  it("matches nested country objects by name or code", () => {
    assert.equal(
      resolveEmployeeCountryId(
        { country: { name: "Nigeria", code: "NG" } },
        countries,
      ),
      "ng-id",
    );
    assert.equal(
      resolveEmployeeCountryId(
        { country: { name: "United States" } },
        countries,
      ),
      "us-id",
    );
  });

  it("is case insensitive on the code", () => {
    assert.equal(
      resolveEmployeeCountryId({ country_code: "gb" }, countries),
      "gb-id",
    );
  });

  it("falls back to the country name when no code is present", () => {
    assert.equal(
      resolveEmployeeCountryId({ country: "United States" }, countries),
      "us-id",
    );
  });

  it("prefers a code match over a mismatched name", () => {
    assert.equal(
      resolveEmployeeCountryId(
        { country: "Somewhere Else", country_code: "US" },
        countries,
      ),
      "us-id",
    );
  });

  it("returns undefined when nothing matches", () => {
    assert.equal(
      resolveEmployeeCountryId(
        { country: "Atlantis", country_code: "AT" },
        countries,
      ),
      undefined,
    );
  });

  it("returns undefined for missing employee or country data", () => {
    assert.equal(resolveEmployeeCountryId(undefined, countries), undefined);
    assert.equal(resolveEmployeeCountryId({}, countries), undefined);
    assert.equal(
      resolveEmployeeCountryId({ country: "Nigeria" }, undefined),
      undefined,
    );
  });
});
