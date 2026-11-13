import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createdNamedResourceId } from "./createdNamedResourceId";

describe("createdNamedResourceId", () => {
  it("reads a string id from the created entity", () => {
    assert.equal(
      createdNamedResourceId({ data: { id: "lvl-9", name: "Intern" } }),
      "lvl-9",
    );
  });

  it("returns null when the payload has no id", () => {
    assert.equal(createdNamedResourceId({ data: { name: "Intern" } }), null);
    assert.equal(createdNamedResourceId({ data: {} }), null);
    assert.equal(createdNamedResourceId(null), null);
  });
});
