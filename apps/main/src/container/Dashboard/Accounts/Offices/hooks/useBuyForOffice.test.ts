import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isBuyableOffice } from "./isBuyableOffice";
import { canShowBuyForOffice } from "./useBuyForOffice";
import type { Office } from "../../types";

const physical = {
  type: "Physical",
  status: "active",
  address: "1 Market St",
} as Office;

const remote = {
  type: "Remote",
  status: "active",
} as Office;

describe("canShowBuyForOffice", () => {
  it("shows the action for every office the user can manage", () => {
    assert.equal(canShowBuyForOffice(physical, true), true);
    assert.equal(canShowBuyForOffice(remote, true), true);
    assert.equal(
      canShowBuyForOffice({ ...physical, address: undefined }, true),
      true,
    );
    assert.equal(
      canShowBuyForOffice({ ...physical, subsidiaryId: "other-entity" }, true),
      true,
    );
    assert.equal(
      canShowBuyForOffice({ ...physical, status: "shutting_down" }, true),
      true,
    );
  });

  it("hides the action when the user cannot manage the office", () => {
    assert.equal(canShowBuyForOffice(physical, false), false);
    assert.equal(canShowBuyForOffice(undefined, true), false);
  });
});

describe("isBuyableOffice", () => {
  it("allows an active physical office with an address", () => {
    assert.equal(isBuyableOffice(physical), true);
  });

  it("allows an active remote office without an address", () => {
    assert.equal(isBuyableOffice(remote), true);
    assert.equal(isBuyableOffice({ ...remote, address: undefined }), true);
  });

  it("rejects a physical office with no address", () => {
    assert.equal(isBuyableOffice({ ...physical, address: undefined }), false);
  });

  it("rejects closed or shutting-down offices of either type", () => {
    assert.equal(isBuyableOffice({ ...physical, status: "closed" }), false);
    assert.equal(isBuyableOffice({ ...remote, status: "closed" }), false);
    assert.equal(
      isBuyableOffice({ ...physical, status: "shutting_down" }),
      false,
    );
    assert.equal(
      isBuyableOffice({ ...remote, status: "shutting_down" }),
      false,
    );
  });
});
