import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  resolveStorageActionCountryId,
  storageActionCountryNameFromItems,
} from "./storageActionFeeCountry";

describe("storageActionFeeCountry", () => {
  it("resolves the cart equipment country name to a country uuid", () => {
    assert.equal(
      resolveStorageActionCountryId(
        [{ id: "country-us", name: "United States" }],
        "United States",
      ),
      "country-us",
    );
    assert.equal(
      resolveStorageActionCountryId(
        [{ id: "country-us", name: "United States" }],
        "united states",
      ),
      "country-us",
    );
    assert.equal(
      resolveStorageActionCountryId(
        [{ id: "country-us", name: "United States" }],
        undefined,
      ),
      undefined,
    );
  });

  it("reads the country name from a storage cart or order-summary item", () => {
    assert.equal(
      storageActionCountryNameFromItems([{ country: "United States" }]),
      "United States",
    );
    assert.equal(
      storageActionCountryNameFromItems([
        { country: { name: "United States" } },
      ]),
      "United States",
    );
    assert.equal(
      storageActionCountryNameFromItems([
        { asset: { country: "United States" } },
      ]),
      "United States",
    );
  });
});
