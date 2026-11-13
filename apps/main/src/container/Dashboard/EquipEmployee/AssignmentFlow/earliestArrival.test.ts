import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  deliveryLeadDays,
  earliestArrivalFor,
  earliestArrivalForAll,
  parseDeliveryRangeMin,
} from "./earliestArrival";

describe("earliestArrival", () => {
  it("reads the near end of an arrival range", () => {
    assert.equal(parseDeliveryRangeMin("Arrives in 5 - 7 Days"), 5);
    assert.equal(parseDeliveryRangeMin("Arrives in 3 - 4 Days"), 3);
  });

  it("keeps the earliest fee date on the local calendar day", () => {
    const now = new Date(2026, 9, 14, 15, 0, 0);
    assert.equal(deliveryLeadDays("2-3 Days"), 7);
    assert.equal(deliveryLeadDays("7-12"), 12);
    assert.equal(earliestArrivalFor("2-3 Days", now), "2026-10-21");
    assert.equal(earliestArrivalFor(undefined, now), "2026-10-21");
  });

  it("uses the slowest device for a batch date", () => {
    const faster = earliestArrivalFor("Arrives in 3 - 4 Days");
    const slower = earliestArrivalFor("Arrives in 10 - 14 Days");
    assert.equal(
      earliestArrivalForAll([
        "Arrives in 3 - 4 Days",
        "Arrives in 10 - 14 Days",
      ]),
      slower,
    );
    assert.ok(slower > faster);
  });
});
