import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { regionCountryCode } from "./regionCountryCodes";

describe("regionCountryCode", () => {
  it("maps wizard region labels to ISO country codes for flags", () => {
    assert.equal(regionCountryCode["United States"], "US");
    assert.equal(regionCountryCode["United Kingdom"], "GB");
    assert.equal(regionCountryCode.Canada, "CA");
  });
});
