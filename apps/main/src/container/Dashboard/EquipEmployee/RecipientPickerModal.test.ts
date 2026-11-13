import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("RecipientPickerModal", () => {
  it("reads deliverable offices from the response data array", () => {
    const source = readFileSync(
      new URL("./RecipientPickerModal.tsx", import.meta.url),
      "utf8",
    );

    assert.match(source, /officesRes\?\.data \?\? \[\]/);
    assert.doesNotMatch(source, /typeof officesRes/);
  });
});
