import assert from "node:assert/strict";
import { test } from "node:test";
import {
  marketConnectionSchema,
  toMarketConnection,
} from "./marketConnectionSchema";

const valid = {
  apiKey: "dummy-key",
  remoteStoreId: "jumia-lagos",
  locationId: "11111111-1111-1111-1111-111111111111",
};

test("marketConnectionSchema accepts a complete dummy connection", () => {
  const parsed = marketConnectionSchema.safeParse(valid);
  assert.equal(parsed.success, true);
});

test("marketConnectionSchema rejects short keys and missing stores", () => {
  assert.equal(
    marketConnectionSchema.safeParse({ ...valid, apiKey: "short" }).success,
    false,
  );
  assert.equal(
    marketConnectionSchema.safeParse({ ...valid, remoteStoreId: "" }).success,
    false,
  );
  assert.equal(
    marketConnectionSchema.safeParse({ ...valid, locationId: "not-a-uuid" })
      .success,
    false,
  );
});

test("toMarketConnection maps store names and starts with no products", () => {
  const connection = toMarketConnection({
    values: valid,
    remoteStoreName: "Jumia Lagos Hub",
    locationName: "Lekki",
  });
  assert.equal(connection.apiKey, "dummy-key");
  assert.equal(connection.remoteStoreName, "Jumia Lagos Hub");
  assert.equal(connection.locationName, "Lekki");
  assert.deepEqual(connection.mappedRemoteProductIds, []);
  assert.equal(Number.isNaN(Date.parse(connection.connectedAt)), false);
});
