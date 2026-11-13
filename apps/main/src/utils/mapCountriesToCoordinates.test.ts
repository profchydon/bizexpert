import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { mapCountriesToCoordinates } from "./mapCountriesToCoordinates";

describe("mapCountriesToCoordinates", () => {
  it("maps countries by ISO code", () => {
    const result = mapCountriesToCoordinates([
      { country: "Nigeria", country_code: "NG" },
    ]);

    assert.equal(result.length, 1);
    assert.equal(result[0]?.address, "Nigeria");
    assert.equal(result[0]?.lat, 10);
    assert.equal(result[0]?.lng, 8);
    assert.equal(result[0]?.flag, "🇳🇬");
  });

  it("falls back to country name when code is missing", () => {
    const result = mapCountriesToCoordinates([{ country: "United Kingdom" }]);

    assert.equal(result.length, 1);
    assert.equal(result[0]?.address, "United Kingdom");
    assert.equal(result[0]?.lat, 54);
    assert.equal(result[0]?.lng, -2);
  });

  it("skips countries that cannot be resolved", () => {
    const result = mapCountriesToCoordinates([
      { country: "Unknown Country" },
      { country: "United States", country_code: "US" },
    ]);

    assert.equal(result.length, 1);
    assert.equal(result[0]?.address, "United States");
  });
});
