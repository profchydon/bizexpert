import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { mapEntityCountryLabel } from "./mapEntityCountryLabel";

describe("mapEntityCountryLabel", () => {
  it("returns string countries unchanged", () => {
    assert.equal(mapEntityCountryLabel("United Kingdom"), "United Kingdom");
  });

  it("maps country objects to their name", () => {
    assert.equal(
      mapEntityCountryLabel({
        id: "1",
        name: "United Kingdom",
        code: "GB",
        currency_code: "GBP",
        currency_symbol: "£",
        payment_processor: "stripe",
      }),
      "United Kingdom",
    );
  });

  it("falls back to code when name is missing", () => {
    assert.equal(
      mapEntityCountryLabel({
        id: "1",
        name: "",
        code: "GB",
      }),
      "GB",
    );
  });

  it("returns empty string for missing values", () => {
    assert.equal(mapEntityCountryLabel(null), "");
    assert.equal(mapEntityCountryLabel(undefined), "");
  });
});
