import assert from "node:assert/strict";
import { test } from "node:test";
import type { Location } from "@/types/bizexpert";
import {
  toCreateLocationPayload,
  toUpdateLocationPayload,
  valuesFromLocation,
} from "./createLocationSchema";

const baseValues = {
  name: "Lagos store",
  storeMode: "regular" as const,
  businessType: "retail" as const,
  vatRate: 7.5,
  address: "12 Marina",
  phone: "",
  isDefault: false,
};

test("toCreateLocationPayload maps regular store to shop type", () => {
  const payload = toCreateLocationPayload({
    ...baseValues,
    isDefault: true,
  });
  assert.equal(payload.type, "shop");
  assert.equal(payload.businessType, "retail");
  assert.equal(payload.vatRate, 7.5);
  assert.equal(payload.address, "12 Marina");
  assert.equal(payload.isDefault, true);
});

test("toCreateLocationPayload maps warehouse mode", () => {
  const payload = toCreateLocationPayload({
    ...baseValues,
    storeMode: "warehouse",
  });
  assert.equal(payload.type, "warehouse");
});

test("valuesFromLocation maps API fields to the form", () => {
  const location: Location = {
    id: "loc-1",
    businessId: "biz-1",
    name: "Warehouse",
    type: "warehouse",
    businessType: "wholesale",
    vatRate: 5,
    address: "Plot 1",
    isDefault: false,
    isActive: true,
  };
  assert.deepEqual(valuesFromLocation(location), {
    name: "Warehouse",
    storeMode: "warehouse",
    businessType: "wholesale",
    vatRate: 5,
    address: "Plot 1",
    phone: "",
    isDefault: false,
  });
});

test("toUpdateLocationPayload preserves branch when staying regular", () => {
  const payload = toUpdateLocationPayload(
    { ...baseValues, storeMode: "regular" },
    "branch",
  );
  assert.equal(payload.type, "branch");
});
