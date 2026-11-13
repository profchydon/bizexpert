import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isQueryResultPending } from "@/utils/isQueryResultPending";

describe("isQueryResultPending", () => {
  it("is pending before the first response", () => {
    assert.equal(
      isQueryResultPending({
        isUninitialized: true,
        isLoading: false,
        isFetching: false,
        hasRows: false,
      }),
      true,
    );
    assert.equal(
      isQueryResultPending({
        isLoading: true,
        isFetching: true,
        hasRows: false,
      }),
      true,
    );
    assert.equal(
      isQueryResultPending({
        isLoading: false,
        isFetching: true,
        hasRows: false,
      }),
      true,
    );
  });

  it("is not pending once rows exist, even while refetching", () => {
    assert.equal(
      isQueryResultPending({
        isLoading: false,
        isFetching: true,
        hasRows: true,
      }),
      false,
    );
  });

  it("stays pending while refetching with no rows yet", () => {
    assert.equal(
      isQueryResultPending({
        isLoading: false,
        isFetching: true,
        hasRows: false,
      }),
      true,
    );
  });

  it("is not pending after an empty response resolves", () => {
    assert.equal(
      isQueryResultPending({
        isLoading: false,
        isFetching: false,
        hasRows: false,
      }),
      false,
    );
  });
});
