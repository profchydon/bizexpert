import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { IOrder, ISubOrder } from "@/types/orders";
import {
  getSelectDisabledReason,
  getVerifyDisabledReason,
} from "./rowDisableReasons";

describe("getSelectDisabledReason", () => {
  it("returns null for a selectable row", () => {
    assert.equal(
      getSelectDisabledReason(
        { type: "reassign", status: "pending" } as unknown as ISubOrder,
        { status: "pending" } as unknown as IOrder,
      ),
      null,
    );
  });

  it("explains a locked order status", () => {
    const reason = getSelectDisabledReason(
      { type: "reassign", status: "pending" } as unknown as ISubOrder,
      { status: "completed" } as unknown as IOrder,
    );
    assert.match(reason || "", /in progress or completed/);
  });

  it("explains storage items", () => {
    const reason = getSelectDisabledReason(
      { type: "storage", status: "pending" } as unknown as ISubOrder,
      { status: "pending" } as unknown as IOrder,
    );
    assert.match(reason || "", /Storage items/);
  });

  it("explains a non-updatable row status", () => {
    const reason = getSelectDisabledReason(
      { type: "reassign", status: "picked_up" } as unknown as ISubOrder,
      { status: "pending" } as unknown as IOrder,
    );
    assert.match(reason || "", /can no longer be updated/);
  });
});

describe("getVerifyDisabledReason", () => {
  it("returns null when not pending", () => {
    assert.equal(getVerifyDisabledReason(false, false), null);
  });

  it("returns null when pending and verifiable", () => {
    assert.equal(getVerifyDisabledReason(true, true), null);
  });

  it("explains a pending row with no verifiable address", () => {
    assert.match(
      getVerifyDisabledReason(true, false) || "",
      /no address that can be verified/,
    );
  });
});
