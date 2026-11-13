import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  resolveCountryEta,
  resolveDeliveryEstimate,
} from "./countryDeliveryEstimate";

const countries = [
  { id: "gb-1", name: "United Kingdom", code: "gb", eta: "3-5" },
  { id: "ng-1", name: "Nigeria", code: "ng", eta: null },
];

describe("resolveCountryEta", () => {
  it("matches by country id first", () => {
    assert.equal(
      resolveCountryEta({ id: "gb-1", name: "Other", code: "xx" }, countries),
      "3-5",
    );
  });

  it("falls back to a case-insensitive code match", () => {
    assert.equal(
      resolveCountryEta({ code: "GB", name: "Other" }, countries),
      "3-5",
    );
  });

  it("falls back to a case-insensitive name match", () => {
    assert.equal(
      resolveCountryEta({ name: "united kingdom" }, countries),
      "3-5",
    );
  });

  it("returns undefined when nothing matches", () => {
    assert.equal(
      resolveCountryEta({ id: "fr-1", name: "France", code: "fr" }, countries),
      undefined,
    );
  });

  it("returns undefined for an empty selection", () => {
    assert.equal(resolveCountryEta(undefined, countries), undefined);
  });
});

describe("resolveDeliveryEstimate", () => {
  it("formats the matched country's eta", () => {
    assert.equal(
      resolveDeliveryEstimate("pricing-1", { id: "gb-1" }, countries),
      "3-5 Days",
    );
  });

  it("falls back to the default estimate when nothing matches and nothing is remembered", () => {
    assert.equal(
      resolveDeliveryEstimate("pricing-1", { id: "ng-1" }, countries),
      "2 - 3 Days",
    );
  });

  it("falls back to the default estimate without a pricing id", () => {
    assert.equal(
      resolveDeliveryEstimate(undefined, undefined, []),
      "2 - 3 Days",
    );
  });
});
