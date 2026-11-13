import assert from "node:assert/strict";
import { test } from "node:test";
import type { MarketConnection } from "./marketStorage";
import {
  marketStorageKey,
  parseMarketConnections,
  removeMarketConnection,
  upsertMarketConnection,
} from "./marketStorage";

const sample: MarketConnection = {
  apiKey: "dummy-key-1",
  remoteStoreId: "jumia-lagos",
  remoteStoreName: "Jumia Lagos Hub",
  locationId: "11111111-1111-1111-1111-111111111111",
  locationName: "Lekki",
  mappedRemoteProductIds: ["jp-1"],
  connectedAt: "2026-10-31T00:00:00.000Z",
};

test("marketStorageKey is scoped by business", () => {
  assert.equal(marketStorageKey("biz-1"), "bizexpert.markets.biz-1");
});

test("parseMarketConnections handles empty and invalid payloads", () => {
  assert.deepEqual(parseMarketConnections(null), {});
  assert.deepEqual(parseMarketConnections("{"), {});
  assert.deepEqual(parseMarketConnections(JSON.stringify({ jumia: sample })), {
    jumia: sample,
  });
});

test("upsert and remove keep other market connections", () => {
  const withJumia = upsertMarketConnection({}, "jumia", sample);
  const withBoth = upsertMarketConnection(withJumia, "konga", {
    ...sample,
    remoteStoreId: "konga-ikeja",
    remoteStoreName: "Konga Ikeja",
  });
  assert.equal(withBoth.jumia?.remoteStoreId, "jumia-lagos");
  assert.equal(withBoth.konga?.remoteStoreId, "konga-ikeja");
  assert.equal(removeMarketConnection(withBoth, "jumia").jumia, undefined);
  assert.equal(
    removeMarketConnection(withBoth, "jumia").konga?.remoteStoreId,
    "konga-ikeja",
  );
});
