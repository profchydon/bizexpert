import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { collectClaimedStorageIds } from "./storagePool";
import type { EquipDeviceItem } from "./equipTypes";

const storage = (productId: string): EquipDeviceItem => ({
  lineId: productId,
  productId,
  name: "Apple MacBook Air M3",
  source: "STORAGE",
  origin: "MANUAL",
  unitPrice: 0,
  currency: "USD",
  quantity: 1,
  config: "none",
});

const marketplace = (productId: string): EquipDeviceItem => ({
  ...storage(productId),
  source: "MARKETPLACE",
});

describe("collectClaimedStorageIds", () => {
  it("collects storage ids claimed by other employees only", () => {
    const itemsByEmployee = {
      e1: [storage("s-1")],
      e2: [storage("s-2"), storage("s-3")],
      e3: [marketplace("m-1")],
    };

    const claimed = collectClaimedStorageIds(itemsByEmployee, "e1", [
      "e1",
      "e2",
      "e3",
    ]);

    assert.deepEqual([...claimed].sort(), ["s-2", "s-3"]);
  });

  it("excludes the current employee's own storage devices", () => {
    const itemsByEmployee = { e1: [storage("s-1")], e2: [storage("s-2")] };

    const claimed = collectClaimedStorageIds(itemsByEmployee, "e2", [
      "e1",
      "e2",
    ]);

    assert.ok(claimed.has("s-1"));
    assert.ok(!claimed.has("s-2"));
  });

  it("ignores employees no longer in the batch (removed employees free their devices)", () => {
    const itemsByEmployee = {
      e1: [storage("s-1")],
      removed: [storage("s-9")],
    };

    const claimed = collectClaimedStorageIds(itemsByEmployee, "e2", ["e1"]);

    assert.ok(claimed.has("s-1"));
    assert.ok(!claimed.has("s-9"));
  });

  it("ignores marketplace devices", () => {
    const itemsByEmployee = { e1: [marketplace("m-1")] };

    const claimed = collectClaimedStorageIds(itemsByEmployee, "e2", ["e1"]);

    assert.equal(claimed.size, 0);
  });
});
