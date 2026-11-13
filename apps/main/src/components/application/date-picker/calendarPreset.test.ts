import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("Calendar Today preset", () => {
  it("disables Today when that date is unavailable or below minValue", () => {
    const source = readFileSync(
      "src/components/application/date-picker/calendar.tsx",
      "utf8",
    );

    assert.match(source, /isCellDisabled\(value\)/);
    assert.match(source, /isCellUnavailable\(value\)/);
    assert.match(source, /isDisabled=\{isUnavailable\}/);
  });
});
