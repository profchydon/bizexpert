import assert from "node:assert/strict";
import { test } from "node:test";
import {
  customerLedgerSchema,
  formatLedgerType,
  toLedgerPayload,
} from "./customerLedgerSchema";

test("toLedgerPayload omits a blank note", () => {
  assert.deepEqual(
    toLedgerPayload({ type: "wallet_credit", amount: 2000, note: "  " }),
    { type: "wallet_credit", amount: 2000 },
  );
});

test("customerLedgerSchema requires a positive amount", () => {
  const parsed = customerLedgerSchema.safeParse({
    type: "debt",
    amount: 0,
  });
  assert.equal(parsed.success, false);
});

test("formatLedgerType maps known ledger types", () => {
  assert.equal(formatLedgerType("write_off"), "Write off");
  assert.equal(formatLedgerType("unknown"), "unknown");
});
