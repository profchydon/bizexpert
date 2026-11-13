import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isOrdersListAwaitingResults,
  isOrdersListRefreshing,
} from "./ordersListPending";

test("a new filter shows the loader while its results are still missing", () => {
  assert.equal(
    isOrdersListAwaitingResults({
      isLoading: false,
      isFetching: true,
      hasCurrentResults: false,
    }),
    true,
  );
  assert.equal(
    isOrdersListRefreshing({
      isFetching: true,
      hasCurrentResults: false,
    }),
    false,
  );
});

test("the first orders load shows the loader", () => {
  assert.equal(
    isOrdersListAwaitingResults({
      isUninitialized: true,
      isLoading: false,
      isFetching: false,
      hasCurrentResults: false,
    }),
    true,
  );
});

test("a refresh of the current filter keeps the rows and marks them busy", () => {
  assert.equal(
    isOrdersListAwaitingResults({
      isLoading: false,
      isFetching: true,
      hasCurrentResults: true,
    }),
    false,
  );
  assert.equal(
    isOrdersListRefreshing({
      isFetching: true,
      hasCurrentResults: true,
    }),
    true,
  );
});

test("settled filter results are not loading", () => {
  assert.equal(
    isOrdersListAwaitingResults({
      isLoading: false,
      isFetching: false,
      hasCurrentResults: true,
    }),
    false,
  );
  assert.equal(
    isOrdersListRefreshing({
      isFetching: false,
      hasCurrentResults: true,
    }),
    false,
  );
});
