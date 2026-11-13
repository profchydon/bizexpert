import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("useAssignmentOffices", () => {
  it("maps deliverable offices from the list row", () => {
    const source = readFileSync(
      new URL("./useAssignmentOffices.ts", import.meta.url),
      "utf8",
    );

    assert.match(source, /toUiOffice\(row\)/);
    assert.doesNotMatch(source, /office_admins/);
  });
});
