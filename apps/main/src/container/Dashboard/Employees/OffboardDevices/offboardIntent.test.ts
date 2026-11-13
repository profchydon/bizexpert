import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  applyOffboardIntentToLines,
  consumeOffboardIntent,
  startOffboardWithDisposition,
} from "./offboardIntent";

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    },
  });
});

afterEach(() => {
  Reflect.deleteProperty(globalThis, "sessionStorage");
});

describe("offboardIntent", () => {
  it("stores and consumes intent for the matching employee", () => {
    startOffboardWithDisposition({
      employeeId: "emp-1",
      deviceIds: ["dev-1"],
      disposition: "STORE",
    });
    assert.deepEqual(consumeOffboardIntent("emp-1"), {
      employeeId: "emp-1",
      deviceIds: ["dev-1"],
      disposition: "STORE",
    });
    assert.equal(consumeOffboardIntent("emp-1"), null);
  });

  it("applies disposition and selection to matching device lines", () => {
    const lines = [
      {
        id: "line-1",
        equipmentId: "dev-1",
        name: "Laptop",
        serial: "SN-1",
        imageUrl: null,
        disposition: "STORE" as const,
        wipeType: "None" as const,
        fee: 0,
      },
      {
        id: "line-2",
        equipmentId: "dev-2",
        name: "Phone",
        serial: "SN-2",
        imageUrl: null,
        disposition: "STORE" as const,
        wipeType: "None" as const,
        fee: 0,
      },
    ];

    const result = applyOffboardIntentToLines(lines, {
      employeeId: "emp-1",
      deviceIds: ["dev-1"],
      disposition: "DISPOSE",
    });

    assert.deepEqual(result.selection, ["line-1"]);
    assert.equal(result.lines.length, 1);
    assert.equal(result.lines[0]?.disposition, "DISPOSE");
    assert.equal(result.lines[0]?.wipeType, "Destruction Certificate");
  });

  it("returns only intent devices with disposition applied", () => {
    const lines = [
      {
        id: "line-1",
        equipmentId: "dev-1",
        name: "Laptop",
        serial: "SN-1",
        imageUrl: null,
        disposition: "STORE" as const,
        wipeType: "None" as const,
        fee: 0,
      },
      {
        id: "line-2",
        equipmentId: "dev-2",
        name: "Phone",
        serial: "SN-2",
        imageUrl: null,
        disposition: "STORE" as const,
        wipeType: "None" as const,
        fee: 0,
      },
    ];

    const result = applyOffboardIntentToLines(lines, {
      employeeId: "emp-1",
      deviceIds: ["dev-1"],
      disposition: "DISPOSE",
    });

    assert.deepEqual(
      result.lines.map((line) => line.equipmentId),
      ["dev-1"],
    );
    assert.deepEqual(result.selection, ["line-1"]);
    assert.equal(result.lines[0]?.disposition, "DISPOSE");
  });

  it("matches device ids regardless of string coercion", () => {
    const lines = [
      {
        id: "line-1",
        equipmentId: 42,
        name: "Laptop",
        serial: "SN-1",
        imageUrl: null,
        disposition: "STORE" as const,
        wipeType: "None" as const,
        fee: 0,
      },
    ];

    const result = applyOffboardIntentToLines(lines as any, {
      employeeId: "emp-1",
      deviceIds: ["42"],
      disposition: "REASSIGN",
    });

    assert.deepEqual(result.selection, ["line-1"]);
    assert.equal(result.lines[0]?.disposition, "REASSIGN");
  });

  it("consumes intent when employee ids differ only by type", () => {
    startOffboardWithDisposition({
      employeeId: "14",
      deviceIds: ["dev-1"],
      disposition: "STORE",
    });
    assert.deepEqual(consumeOffboardIntent("14"), {
      employeeId: "14",
      deviceIds: ["dev-1"],
      disposition: "STORE",
    });
  });
});
