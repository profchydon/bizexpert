import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  emitCartItemAdded,
  emitCartOverviewOpen,
  onCartItemAdded,
  onCartOverviewOpen,
} from "./cartEvents";

describe("cart events", () => {
  it("notifies cart overview listeners separately from item-added listeners", () => {
    let itemAddedCount = 0;
    let overviewOpenCount = 0;

    const removeItemListener = onCartItemAdded(() => {
      itemAddedCount += 1;
    });
    const removeOverviewListener = onCartOverviewOpen(() => {
      overviewOpenCount += 1;
    });

    emitCartOverviewOpen();

    assert.equal(itemAddedCount, 0);
    assert.equal(overviewOpenCount, 1);

    removeItemListener();
    removeOverviewListener();
  });
});
