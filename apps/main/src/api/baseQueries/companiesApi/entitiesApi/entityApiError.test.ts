import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { entityApiErrorMessage } from "./entityApiError";

describe("entityApiErrorMessage", () => {
  it("returns the API message when present", () => {
    assert.equal(
      entityApiErrorMessage(
        { data: { message: "Close readiness failed" } },
        "fallback",
      ),
      "Close readiness failed",
    );
  });

  it("uses the field error instead of Validation error", () => {
    assert.equal(
      entityApiErrorMessage(
        {
          data: {
            message: "Validation error",
            errors: { admin_user_ids: ["Select an account member."] },
          },
        },
        "fallback",
      ),
      "Select an account member.",
    );
  });

  it("falls back when the message is only Validation error", () => {
    assert.equal(
      entityApiErrorMessage(
        { data: { message: "Validation error" } },
        "fallback",
      ),
      "fallback",
    );
  });

  it("falls back when the message is missing", () => {
    assert.equal(
      entityApiErrorMessage({ data: { message: "  " } }, "fallback"),
      "fallback",
    );
    assert.equal(entityApiErrorMessage(undefined, "fallback"), "fallback");
  });
});
