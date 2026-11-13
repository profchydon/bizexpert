import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildOfficeLocation,
  countryMismatchError,
  parseAddressComponents,
  streetAddressError,
} from "./addressParts";

const streetComponents = [
  { long_name: "10", short_name: "10", types: ["street_number"] },
  { long_name: "King Street", short_name: "King St", types: ["route"] },
  { long_name: "London", short_name: "London", types: ["locality"] },
  {
    long_name: "England",
    short_name: "England",
    types: ["administrative_area_level_1"],
  },
  { long_name: "United Kingdom", short_name: "GB", types: ["country"] },
];

describe("addressParts", () => {
  it("parses street-level geocode components", () => {
    assert.deepEqual(parseAddressComponents(streetComponents), {
      streetNumber: "10",
      street: "King Street",
      city: "London",
      state: "England",
      country: "United Kingdom",
      isoCode: "GB",
    });
  });

  it("requires a street name and number", () => {
    const cityOnly = parseAddressComponents([
      { long_name: "London", short_name: "London", types: ["locality"] },
    ]);
    assert.equal(
      streetAddressError(cityOnly),
      "Please select a valid street address with a street number.",
    );
    assert.equal(
      streetAddressError(parseAddressComponents(streetComponents)),
      null,
    );
  });

  it("rejects an address outside the restricted country", () => {
    const parsed = parseAddressComponents(streetComponents);
    assert.equal(countryMismatchError(parsed, null), null);
    assert.equal(
      countryMismatchError(parsed, "US"),
      "Selected address is not within the specified country (US).",
    );
  });

  it("builds an office location with the ISO currency", () => {
    const parsed = parseAddressComponents(streetComponents);
    assert.deepEqual(
      buildOfficeLocation("10 King Street, London", { lat: 1, lng: 2 }, parsed),
      {
        lat: 1,
        lng: 2,
        address: "10 King Street, London",
        street: "10 King Street",
        city: "London",
        state: "England",
        country: "United Kingdom",
        isoCode: "GB",
        currencyCode: "GBP",
        streetNumber: "10",
      },
    );
  });
});
