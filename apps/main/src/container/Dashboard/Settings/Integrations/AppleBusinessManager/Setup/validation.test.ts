import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { setupFormSchema } from "./validation";

describe("Apple Business Manager setupFormSchema", () => {
  it("accepts a valid ABM ID", () => {
    const result = setupFormSchema.safeParse({ abm_id: "ORG-12345678" });
    assert.equal(result.success, true);
  });

  it("rejects an ABM ID shorter than 2 characters", () => {
    const result = setupFormSchema.safeParse({ abm_id: "O" });
    assert.equal(result.success, false);
  });

  it("rejects a missing ABM ID", () => {
    const result = setupFormSchema.safeParse({});
    assert.equal(result.success, false);
  });
});
