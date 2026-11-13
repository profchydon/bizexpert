import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapDetailSpecifications } from "./mapDetailSpecifications";

describe("mapDetailSpecifications", () => {
  it("maps API summary spec keys to readable labels", () => {
    const specs = mapDetailSpecifications({
      processor: "M2 Pro Chip",
      memory: "16GB Unified Memory",
    });

    assert.deepEqual(specs, [
      { label: "Processor", value: "M2 Pro Chip" },
      { label: "Memory", value: "16GB Unified Memory" },
    ]);
  });
});
