import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createEmptyDevice } from "./data";
import {
  consumeRfqCreateRequestSession,
  RFQ_CREATE_REQUEST_SESSION_KEY,
  storeRfqCreateRequestSession,
} from "./rfqCreateRequestPrefillStorage";

class MemorySessionStorage {
  private readonly store = new Map<string, string>();

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  removeItem(key: string) {
    this.store.delete(key);
  }
}

describe("rfqCreateRequestPrefillStorage", () => {
  it("stores and consumes a create-request session once", () => {
    const sessionStorage = new MemorySessionStorage();
    (
      globalThis as unknown as { sessionStorage: MemorySessionStorage }
    ).sessionStorage = sessionStorage;

    const devices = [
      {
        ...createEmptyDevice("1"),
        deviceName: "HP Speakers",
        quantity: "5",
      },
    ];
    const session = {
      devices,
      returnHref: "/dashboard/orders?tab=rfqs&rfq_id=rfq-1",
    };

    storeRfqCreateRequestSession(session);
    assert.equal(
      sessionStorage.getItem(RFQ_CREATE_REQUEST_SESSION_KEY),
      JSON.stringify(session),
    );

    assert.deepEqual(consumeRfqCreateRequestSession(), session);
    assert.equal(sessionStorage.getItem(RFQ_CREATE_REQUEST_SESSION_KEY), null);
    assert.equal(consumeRfqCreateRequestSession(), null);

    delete (globalThis as unknown as { sessionStorage?: MemorySessionStorage })
      .sessionStorage;
  });
});
