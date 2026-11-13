import assert from "node:assert/strict";
import { test } from "node:test";
import {
  emptyPaymentTransactionFilters,
  paymentTransactionHasLocalFilter,
  paymentTransactionParams,
} from "./paymentTransactionFilters";

test("omits blank transaction filters from the payments query", () => {
  assert.deepEqual(paymentTransactionParams(emptyPaymentTransactionFilters), {
    locationId: undefined,
    startDate: undefined,
    endDate: undefined,
    method: undefined,
    limit: 100,
  });
  assert.deepEqual(
    paymentTransactionParams({
      ...emptyPaymentTransactionFilters,
      locationId: "loc-1",
      startDate: "2026-10-01",
      endDate: "2026-10-31",
      method: "cash",
      search: "SAL",
    }),
    {
      locationId: "loc-1",
      startDate: "2026-10-01",
      endDate: "2026-10-31",
      method: "cash",
      limit: 100,
    },
  );
});

test("search is the only local transaction filter", () => {
  assert.equal(
    paymentTransactionHasLocalFilter(emptyPaymentTransactionFilters),
    false,
  );
  assert.equal(
    paymentTransactionHasLocalFilter({
      ...emptyPaymentTransactionFilters,
      search: "ikeja",
    }),
    true,
  );
});
