import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  defaultWipeFor,
  getBulkWipeOptions,
  getWipeOptions,
  isWipeAllowed,
} from "./offboardPricing";

describe("getWipeOptions", () => {
  it("limits Store to None and Full Factory Reset", () => {
    assert.deepEqual(
      getWipeOptions("STORE").map((option) => option.value),
      ["Full Factory Reset", "None"],
    );
  });

  it("limits Dispose to Destruction Certificate only", () => {
    assert.deepEqual(
      getWipeOptions("DISPOSE").map((option) => option.value),
      ["Destruction Certificate"],
    );
  });

  it("limits Reassign to None and Full Factory Reset", () => {
    assert.deepEqual(
      getWipeOptions("REASSIGN").map((option) => option.value),
      ["Full Factory Reset", "None"],
    );
  });
});

describe("isWipeAllowed", () => {
  it("allows only Store-valid wipe types", () => {
    assert.equal(isWipeAllowed("STORE", "None"), true);
    assert.equal(isWipeAllowed("STORE", "Full Factory Reset"), true);
    assert.equal(isWipeAllowed("STORE", "Destruction Certificate"), false);
  });
});

describe("getBulkWipeOptions", () => {
  it("offers Destruction Certificate only when every device is Dispose", () => {
    assert.deepEqual(
      getBulkWipeOptions(["DISPOSE", "DISPOSE"]).map((o) => o.value),
      ["Destruction Certificate"],
    );
  });

  it("excludes Destruction Certificate when any device is Store", () => {
    assert.deepEqual(
      getBulkWipeOptions(["STORE", "STORE"]).map((o) => o.value),
      ["Full Factory Reset", "None"],
    );
  });

  it("returns no common option for mixed Store and Dispose", () => {
    assert.deepEqual(getBulkWipeOptions(["STORE", "DISPOSE"]), []);
  });

  it("shares None and Full Factory Reset across Store and Reassign", () => {
    assert.deepEqual(
      getBulkWipeOptions(["STORE", "REASSIGN"]).map((o) => o.value),
      ["Full Factory Reset", "None"],
    );
  });

  it("returns nothing for an empty selection", () => {
    assert.deepEqual(getBulkWipeOptions([]), []);
  });
});

describe("defaultWipeFor", () => {
  it("defaults Store to None", () => {
    assert.equal(defaultWipeFor("STORE"), "None");
  });

  it("defaults Dispose to Destruction Certificate", () => {
    assert.equal(defaultWipeFor("DISPOSE"), "Destruction Certificate");
  });

  it("defaults Reassign to None", () => {
    assert.equal(defaultWipeFor("REASSIGN"), "None");
  });
});
