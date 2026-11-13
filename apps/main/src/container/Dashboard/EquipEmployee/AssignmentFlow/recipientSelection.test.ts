import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { selectionLabel } from "./recipientSelection";

describe("selectionLabel", () => {
  it("counts people and offices together", () => {
    assert.equal(
      selectionLabel(new Set(["emp:1", "office:hq"])),
      "1 person, 1 office selected",
    );
  });
});
