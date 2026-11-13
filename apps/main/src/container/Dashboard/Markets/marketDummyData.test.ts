import assert from "node:assert/strict";
import { test } from "node:test";
import {
  dummyWebhookUrl,
  remoteOrdersFor,
  remoteProductsFor,
  remoteStoresFor,
} from "./marketDummyData";

test("dummy catalogs exist for Jumia Konga and Jiji", () => {
  assert.equal(remoteStoresFor("jumia").length, 2);
  assert.equal(remoteProductsFor("jumia").length, 3);
  assert.equal(remoteOrdersFor("jumia").length, 2);
  assert.equal(remoteStoresFor("konga")[0]?.id, "konga-ikeja");
  assert.equal(remoteProductsFor("jiji")[0]?.sku, "JJ-CHR1");
  assert.equal(remoteOrdersFor("konga")[0]?.status, "processing");
});

test("dummyWebhookUrl is scoped by market and business", () => {
  assert.equal(
    dummyWebhookUrl("jumia", "biz-1"),
    "https://api.bizexpert.local/webhooks/markets/jumia/biz-1",
  );
});
