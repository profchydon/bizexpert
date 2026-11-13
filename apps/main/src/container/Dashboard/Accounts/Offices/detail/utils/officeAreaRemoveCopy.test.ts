import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildOfficeAreaRemoveCopy } from "./officeAreaRemoveCopy";

describe("buildOfficeAreaRemoveCopy", () => {
  it("blocks removal and asks for a reassign while assets remain", () => {
    const copy = buildOfficeAreaRemoveCopy("Server room", 3);
    assert.equal(copy.blocked, true);
    assert.equal(copy.title, "Reassign assets first");
    assert.equal(
      copy.body,
      "Server room still holds 3 assets. Move them to another area, then remove it.",
    );
  });

  it("uses singular wording for one blocking asset", () => {
    const copy = buildOfficeAreaRemoveCopy("Reception", 1);
    assert.match(copy.body, /still holds 1 asset\. Move them/);
  });

  it("offers the destructive confirm for an empty area", () => {
    const copy = buildOfficeAreaRemoveCopy("Reception", 0);
    assert.equal(copy.blocked, false);
    assert.equal(copy.title, "Remove Reception?");
    assert.equal(
      copy.body,
      "Reception will no longer be available when placing assets. This can't be undone.",
    );
  });

  it("falls back to a generic noun when the name is missing", () => {
    const copy = buildOfficeAreaRemoveCopy("", 0);
    assert.equal(copy.title, "Remove area?");
  });
});
