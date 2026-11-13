import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isPrimaryEntity } from "./isPrimaryEntity";

describe("isPrimaryEntity", () => {
  it("returns true when isPrimary is set", () => {
    assert.equal(
      isPrimaryEntity({ id: "entity-1", isPrimary: true }, "company-1"),
      true,
    );
  });

  it("returns true when the entity id matches the account company id", () => {
    assert.equal(
      isPrimaryEntity({ id: "company-1", isPrimary: false }, "company-1"),
      true,
    );
  });

  it("returns false for non-primary subsidiaries", () => {
    assert.equal(
      isPrimaryEntity({ id: "entity-2", isPrimary: false }, "company-1"),
      false,
    );
  });
});
