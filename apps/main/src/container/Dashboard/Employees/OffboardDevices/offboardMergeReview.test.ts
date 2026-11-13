import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { DeviceLine } from "@/types/offboard";
import { mergeDeviceLinesWithReview } from "./offboardPricing";

const line = (overrides: Partial<DeviceLine> = {}): DeviceLine => ({
  id: "d1",
  name: "MacBook Pro",
  serial: "SN-1",
  imageUrl: null,
  disposition: "STORE",
  wipeType: "None",
  fee: 0,
  ...overrides,
});

describe("mergeDeviceLinesWithReview", () => {
  it("selects every line when there is no review", () => {
    const built = [line({ id: "d1" }), line({ id: "d2" })];

    const { lines, selection } = mergeDeviceLinesWithReview(built, undefined);

    assert.deepEqual(
      lines.map((entry) => entry.id),
      ["d1", "d2"],
    );
    assert.deepEqual(selection, ["d1", "d2"]);
  });

  it("applies the reviewed disposition, wipe, and reassign target", () => {
    const built = [line({ id: "d1" }), line({ id: "d2" })];
    const reviewed = [
      line({
        id: "d2",
        disposition: "REASSIGN",
        wipeType: "Full Factory Reset",
        reassignTarget: { id: "emp-9", name: "Russel Hahn" },
      }),
    ];

    const { lines, selection } = mergeDeviceLinesWithReview(built, reviewed);

    const d2 = lines.find((entry) => entry.id === "d2");
    assert.equal(d2?.disposition, "REASSIGN");
    assert.equal(d2?.wipeType, "Full Factory Reset");
    assert.equal(d2?.reassignTarget?.id, "emp-9");
    assert.deepEqual(selection, ["d2"]);
  });

  it("keeps defaults for lines that are not in the review", () => {
    const built = [line({ id: "d1" }), line({ id: "d2" })];
    const reviewed = [line({ id: "d1", disposition: "DISPOSE" })];

    const { lines } = mergeDeviceLinesWithReview(built, reviewed);

    const d2 = lines.find((entry) => entry.id === "d2");
    assert.equal(d2?.disposition, "STORE");
  });

  it("drops reviewed ids that no longer exist on the device", () => {
    const built = [line({ id: "d1" })];
    const reviewed = [line({ id: "d1" }), line({ id: "ghost" })];

    const { selection } = mergeDeviceLinesWithReview(built, reviewed);

    assert.deepEqual(selection, ["d1"]);
  });
});
