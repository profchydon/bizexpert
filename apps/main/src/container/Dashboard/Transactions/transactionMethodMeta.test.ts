import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatTransactionMethod,
  transactionFilterToApiType,
} from "./transactionMethodMeta";

describe("transactionFilterToApiType", () => {
  it("sends Cash for Card and Credit for Credit", () => {
    assert.equal(transactionFilterToApiType("all"), null);
    assert.equal(transactionFilterToApiType("card"), "Cash");
    assert.equal(transactionFilterToApiType("credit"), "Credit");
  });
});

describe("formatTransactionMethod", () => {
  it("normalizes Cash and Wallet to the design Card and Credit labels", () => {
    assert.equal(formatTransactionMethod("Card"), "Card");
    assert.equal(formatTransactionMethod("Cash"), "Card");
    assert.equal(formatTransactionMethod("Credit"), "Credit");
    assert.equal(formatTransactionMethod("Wallet"), "Credit");
    assert.equal(formatTransactionMethod(""), "-");
  });
});
