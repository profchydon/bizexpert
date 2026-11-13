import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildEquipReview, reviewToItemsMap } from "./buildEquipReview";
import type { EquipDeviceItem, EquipReviewEmployee } from "./equipTypes";

const device = (lineId: string): EquipDeviceItem => ({
  lineId,
  productId: lineId,
  name: `Device ${lineId}`,
  source: "MARKETPLACE",
  origin: "MANUAL",
  unitPrice: 1000,
  currency: "USD",
  quantity: 1,
  config: "none",
});

describe("buildEquipReview", () => {
  it("snapshots each employee with its current devices", () => {
    const employees = [
      { id: "e1", name: "Ada", role: "Engineer", country: "Nigeria" },
      { id: "e2", name: "Grace", country: "Ghana" },
    ];
    const items: Record<string, EquipDeviceItem[]> = {
      e1: [device("a"), device("b")],
      e2: [],
    };

    const review = buildEquipReview(employees, (id) => items[id] ?? []);

    assert.equal(review.length, 2);
    assert.deepEqual(review[0], {
      id: "e1",
      name: "Ada",
      role: "Engineer",
      country: "Nigeria",
      devices: [device("a"), device("b")],
    });
    assert.equal(review[1].devices.length, 0);
    assert.equal(review[1].role, undefined);
  });
});

describe("reviewToItemsMap", () => {
  it("maps review employees back to an id -> devices record", () => {
    const review: EquipReviewEmployee[] = [
      { id: "e1", name: "Ada", devices: [device("a")] },
      { id: "e2", name: "Grace", devices: [] },
    ];

    assert.deepEqual(reviewToItemsMap(review), {
      e1: [device("a")],
      e2: [],
    });
  });

  it("returns an empty object for undefined review", () => {
    assert.deepEqual(reviewToItemsMap(undefined), {});
  });
});
