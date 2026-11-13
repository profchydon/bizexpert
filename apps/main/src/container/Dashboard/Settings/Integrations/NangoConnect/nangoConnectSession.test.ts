import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { reduceNangoConnectSession } from "./nangoConnectSession";

describe("reduceNangoConnectSession", () => {
  it("waits for close after connect so the success screen stays interactive", () => {
    let state = { connectionId: null, settled: false };

    const connected = reduceNangoConnectSession(state, {
      type: "connect",
      payload: { connectionId: "conn-1" },
    });
    state = connected.state;

    assert.equal(connected.result.status, "pending");
    assert.equal(state.connectionId, "conn-1");

    const closed = reduceNangoConnectSession(state, { type: "close" });
    assert.deepEqual(closed.result, {
      status: "connected",
      connectionId: "conn-1",
    });
  });

  it("treats close without connect as cancelled", () => {
    const result = reduceNangoConnectSession(
      { connectionId: null, settled: false },
      { type: "close" },
    );

    assert.equal(result.result.status, "cancelled");
  });

  it("maps error events to a failure result", () => {
    const result = reduceNangoConnectSession(
      { connectionId: null, settled: false },
      {
        type: "error",
        payload: { errorMessage: "OAuth failed" },
      },
    );

    assert.deepEqual(result.result, {
      status: "error",
      message: "OAuth failed",
    });
  });
});
