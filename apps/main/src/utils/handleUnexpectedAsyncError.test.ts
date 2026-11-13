import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  handleUnexpectedAsyncError,
  isRtkQueryError,
} from "./handleUnexpectedAsyncError";

describe("isRtkQueryError", () => {
  it("detects RTK Query rejection payloads", () => {
    assert.equal(
      isRtkQueryError({ status: 422, data: { message: "Invalid" } }),
      true,
    );
  });

  it("returns false for generic errors", () => {
    assert.equal(isRtkQueryError(new Error("boom")), false);
    assert.equal(isRtkQueryError(null), false);
  });

  it("detects RTK Query network statuses", () => {
    assert.equal(isRtkQueryError({ status: "FETCH_ERROR" }), true);
  });
});

describe("handleUnexpectedAsyncError", () => {
  it("does not treat RTK Query errors as unexpected", () => {
    assert.doesNotThrow(() =>
      handleUnexpectedAsyncError({
        status: 500,
        data: { message: "Server error" },
      }),
    );
  });
});
