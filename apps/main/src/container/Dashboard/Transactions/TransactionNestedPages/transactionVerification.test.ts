import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(
  "src/container/Dashboard/Transactions/TransactionNestedPages/index.tsx",
  "utf8",
);

test("payment callback starts transaction verification without a timer", () => {
  assert.match(source, /\{ skip: !companyId \|\| !getTx_ref \}/);
  assert.doesNotMatch(source, /triggerVerification/);
  assert.doesNotMatch(source, /setTimeout/);
});
