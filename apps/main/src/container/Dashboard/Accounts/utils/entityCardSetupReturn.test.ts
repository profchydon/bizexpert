import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  cardSetupReturnDoneState,
  consumePendingEntityCreate,
  mapCardSetupToDoneState,
  readEntityCardSetupStatus,
} from "./entityCardSetupReturn";

describe("entityCardSetupReturn", () => {
  it("accepts only supported card setup statuses", () => {
    assert.equal(readEntityCardSetupStatus("success"), "success");
    assert.equal(readEntityCardSetupStatus("cancelled"), "cancelled");
    assert.equal(readEntityCardSetupStatus("failed"), null);
    assert.equal(readEntityCardSetupStatus(null), null);
  });

  it("returns null when no pending entity name is stored", () => {
    assert.equal(consumePendingEntityCreate(), null);
  });

  it("maps card setup status to wizard done state", () => {
    assert.deepEqual(
      mapCardSetupToDoneState(
        { name: "bbbb", entityId: "019ff171-a82a-70ce-9dce-7cf303ea1583" },
        "success",
      ),
      {
        name: "bbbb",
        stalled: false,
      },
    );
    assert.deepEqual(
      mapCardSetupToDoneState(
        {
          name: "Acme UK Ltd",
          entityId: "019ff171-a82a-70ce-9dce-7cf303ea1583",
        },
        "cancelled",
      ),
      { name: "Acme UK Ltd", stalled: true },
    );
    assert.equal(mapCardSetupToDoneState(null, "success"), null);
    assert.equal(cardSetupReturnDoneState("success"), null);
  });
});
