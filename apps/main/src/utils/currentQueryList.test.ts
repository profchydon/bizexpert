import assert from "node:assert/strict";
import { test } from "node:test";
import { currentQueryList } from "./currentQueryList";
import { isQueryResultPending } from "./isQueryResultPending";

test("a new filter has no rows until the current response arrives", () => {
  const rows = currentQueryList<{ id: string }>(undefined);

  assert.deepEqual(rows, []);
  assert.equal(
    isQueryResultPending({
      isLoading: false,
      isFetching: true,
      hasRows: rows.length > 0,
    }),
    true,
  );
});

test("the current response is the list that stays on screen", () => {
  const rows = currentQueryList({
    data: { data: [{ id: "device-1" }] },
  });

  assert.deepEqual(rows, [{ id: "device-1" }]);
  assert.equal(
    isQueryResultPending({
      isLoading: false,
      isFetching: true,
      hasRows: rows.length > 0,
    }),
    false,
  );
});
