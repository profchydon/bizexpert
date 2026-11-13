import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { splitCartLines } from "./splitCartLines";

const marketplaceLine = {
  type: "marketplace",
  quantity: 1,
  asset: { id: "asset-1" },
  pricing: { id: "price-1" },
  specification: {
    properties: JSON.stringify({ ram: "16GB" }),
    spec: [],
  },
};

const checkLine = {
  type: "storage_device_check",
  id: "line-1",
  equipment_id: "eq-1",
  company_id: "company-a",
  reason: "Pre-deployment check",
};

const disposalLine = {
  type: "storage_disposal",
  equipment_id: "eq-2",
  company_id: "company-b",
};

const deployLine = {
  type: "storage_deploy_to_employee",
  equipment_id: "eq-3",
  company_id: "company-a",
  employee_id: "emp-3",
};

describe("splitCartLines", () => {
  it("keeps marketplace and storage lines in separate lists", () => {
    const { marketplace, storage } = splitCartLines([
      marketplaceLine,
      checkLine,
      disposalLine,
      deployLine,
    ]);

    assert.equal(marketplace.length, 1);
    assert.equal(marketplace[0]?.pricing.id, "price-1");
    assert.equal(storage.length, 3);
    assert.equal(storage[0]?.type, "storage_device_check");
    assert.equal(storage[1]?.type, "storage_disposal");
    assert.equal(storage[2]?.type, "storage_deploy_to_employee");
  });

  it("treats omitted type as marketplace and skips storage lines without decoding specs", () => {
    const { marketplace, storage } = splitCartLines([
      {
        quantity: 2,
        asset: { id: "asset-2" },
        pricing: { id: "price-2" },
        specification: {
          properties: [{ name: "Ram", value: "8GB" }],
          spec: [],
        },
      },
      checkLine,
    ]);

    assert.equal(marketplace.length, 1);
    assert.equal(marketplace[0]?.quantity, 2);
    assert.equal(storage.length, 1);
    assert.equal(storage[0]?.company_id, "company-a");
  });
});
