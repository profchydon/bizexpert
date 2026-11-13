import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeEquipmentItems,
  resolveDeviceRefreshCountry,
} from "./resolveDeviceRefreshCountry";

describe("resolveDeviceRefreshCountry", () => {
  it("prefers catalog match by url id", () => {
    const result = resolveDeviceRefreshCountry(
      [{ id: "eq-1", country: "United Kingdom", country_code: "GB" } as any],
      "country-1",
      null,
      [{ id: "country-1", name: "United Kingdom", code: "GB" }],
    );

    assert.equal(result.id, "country-1");
    assert.equal(result.name, "United Kingdom");
    assert.equal(result.code, "GB");
  });

  it("falls back to equipment country when url name is missing", () => {
    const result = resolveDeviceRefreshCountry(
      [{ id: "eq-1", country: "United Kingdom", country_code: "GB" } as any],
      "country-1",
      null,
      [{ id: "country-1", name: "United Kingdom", code: "GB" }],
    );

    assert.equal(result.name, "United Kingdom");
  });

  it("normalizes single equipment into an array", () => {
    assert.equal(normalizeEquipmentItems({ id: "eq-1" } as any).length, 1);
    assert.equal(normalizeEquipmentItems(undefined).length, 0);
  });
});
