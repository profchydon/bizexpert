import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { liveIntegrationSyncCopy } from "./liveIntegrationSyncCopy";

describe("liveIntegrationSyncCopy", () => {
  it("surfaces a failed rs-backend sync instead of a green connected state", () => {
    const copy = liveIntegrationSyncCopy("failed", "Nango token expired");
    assert.equal(copy.label, "Sync failed");
    assert.equal(copy.banner, "Nango token expired");
    assert.equal(copy.isFailed, true);
  });

  it("keeps pending setup copy while the first sync is in flight", () => {
    const copy = liveIntegrationSyncCopy("pending");
    assert.equal(copy.label, "Connected — finishing setup…");
    assert.equal(copy.banner, "Finishing setup…");
    assert.equal(copy.isFailed, false);
  });
});
