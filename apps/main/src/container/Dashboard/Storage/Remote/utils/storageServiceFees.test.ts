import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  buildStorageServiceFeeTable,
  lineFeeForAction,
  normalizeServiceFeeResponse,
  subtotalForActions,
} from "./storageServiceFees";
import type { CheckoutItem } from "../hooks/useStorageCheckout";

const fees = {
  Reassignment: 99,
  Storage: 35,
  Dispose: 75,
  Factory_Reset: 50,
  Device_Check: 25,
};

const table = buildStorageServiceFeeTable(fees)!;

const item = (overrides: Partial<CheckoutItem>): CheckoutItem => ({
  id: "item-1",
  kind: "deployment",
  deviceId: "dev-1",
  deviceName: "Dell UltraSharp U2723",
  serialNumber: "DU27-UK-11",
  country: "United Kingdom",
  assetType: "monitor",
  ...overrides,
});

describe("normalizeServiceFeeResponse", () => {
  it("accepts snake_case API keys", () => {
    assert.deepEqual(
      normalizeServiceFeeResponse({
        reassignment: 99,
        storage: 35,
        dispose: 75,
        factory_reset: 50,
        device_check: 25,
      }),
      {
        Reassignment: 99,
        Storage: 35,
        Dispose: 75,
        Factory_Reset: 50,
        Device_Check: 25,
      },
    );
  });
});

describe("buildStorageServiceFeeTable", () => {
  it("returns null when fees are missing", () => {
    assert.equal(buildStorageServiceFeeTable(undefined), null);
    assert.equal(buildStorageServiceFeeTable(null), null);
  });

  it("maps each API fee key", () => {
    assert.deepEqual(table, fees);
  });

  it("keeps a numeric fallback when Storage is nested by type", () => {
    const nested = buildStorageServiceFeeTable({
      Reassignment: 99,
      Storage: { Macbook: 25, Computer: 25 },
      Dispose: 75,
      Factory_Reset: 50,
      Device_Check: 25,
    });

    assert.deepEqual(nested, {
      Reassignment: 99,
      Storage: 0,
      Dispose: 75,
      Factory_Reset: 50,
      Device_Check: 25,
    });
    assert.equal(lineFeeForAction(item({ kind: "disposal" }), nested), 75);
  });
});

describe("lineFeeForAction", () => {
  it("returns zero without a fee table", () => {
    assert.equal(lineFeeForAction(item({}), null), 0);
  });

  it("uses Reassignment for deployment", () => {
    assert.equal(lineFeeForAction(item({ kind: "deployment" }), table), 99);
  });

  it("adds Device_Check when a fresh check is requested on deployment", () => {
    assert.equal(
      lineFeeForAction(
        item({ kind: "deployment", checkNote: "Fresh check before ship" }),
        table,
      ),
      124,
    );
  });

  it("adds Factory_Reset when wipe is requested on deployment", () => {
    assert.equal(
      lineFeeForAction(
        item({ kind: "deployment", wipeRequested: true }),
        table,
      ),
      149,
    );
  });

  it("uses Device_Check for device_check actions", () => {
    assert.equal(lineFeeForAction(item({ kind: "device_check" }), table), 25);
  });

  it("uses Dispose for disposal actions", () => {
    assert.equal(lineFeeForAction(item({ kind: "disposal" }), table), 75);
  });
});

describe("subtotalForActions", () => {
  it("sums line fees from the API table", () => {
    const total = subtotalForActions(
      [
        item({ id: "a", kind: "deployment" }),
        item({ id: "b", kind: "device_check" }),
        item({ id: "c", kind: "disposal" }),
      ],
      table,
    );

    assert.equal(total, 99 + 25 + 75);
  });
});
