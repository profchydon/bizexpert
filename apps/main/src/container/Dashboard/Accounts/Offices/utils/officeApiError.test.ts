import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { officeApiErrorMessage } from "./officeApiError";

describe("officeApiErrorMessage", () => {
  it("surfaces the server message when present", () => {
    const error = { data: { message: "The office already exists." } };
    assert.equal(
      officeApiErrorMessage(error, "fallback"),
      "The office already exists.",
    );
  });

  it("falls back for blank or missing messages", () => {
    assert.equal(
      officeApiErrorMessage({ data: { message: "  " } }, "fallback"),
      "fallback",
    );
    assert.equal(officeApiErrorMessage({ data: {} }, "fallback"), "fallback");
    assert.equal(officeApiErrorMessage(undefined, "fallback"), "fallback");
    assert.equal(officeApiErrorMessage("boom", "fallback"), "fallback");
  });
});
