import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AWAITING_PLACEMENT_DESCRIPTION,
  awaitingPlacementCopy,
} from "./awaitingPlacementCopy";

describe("awaitingPlacementCopy", () => {
  it("explains that the devices already belong to the office", () => {
    assert.equal(
      AWAITING_PLACEMENT_DESCRIPTION,
      "They belong to the office already. Assign each one to a room or to someone who works here.",
    );
  });

  it("uses singular grammar for one device", () => {
    assert.equal(
      awaitingPlacementCopy(1),
      "1 device bought for this office needs placing",
    );
  });

  it("uses plural grammar for several devices", () => {
    assert.equal(
      awaitingPlacementCopy(2),
      "2 devices bought for this office need placing",
    );
  });
});
