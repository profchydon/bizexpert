import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { StoredDevice } from "../types/storage";
import { buildRecommendations } from "./recommendations";

const base: StoredDevice = {
  id: "eq-1",
  deviceName: "Logitech MX Keys",
  model: "Logitech MX Keys",
  deviceType: "Input Device",
  assetType: "Input Device",
  serialNumber: "MXK-DE-6651",
  country: "Germany",
  warehouse: "Germany",
  entrySource: "loaner_return",
  entryDate: "2026-05-28",
  status: "available",
  currency: "USD",
};

describe("buildRecommendations", () => {
  it("does not offer Request a check while a check is already owed", () => {
    const recs = buildRecommendations(
      [{ ...base, status: "pending_check" }],
      "operate",
    );

    assert.equal(recs.length, 1);
    assert.equal(recs[0]?.title, "Awaiting device check");
    assert.deepEqual(recs[0]?.actions, []);
    assert.doesNotMatch(recs[0]?.body ?? "", /Request a check/);
  });

  it("offers a check for an available device with a very stale grade", () => {
    const recs = buildRecommendations(
      [
        {
          ...base,
          status: "available",
          wipeStatus: "wiped",
          grade: "B",
          checkedDaysAgo: 200,
        },
      ],
      "operate",
    );

    assert.equal(recs[0]?.title, "Stale device check");
    assert.deepEqual(recs[0]?.actions, [
      { label: "Request a check", kind: "device_check" },
    ]);
  });

  it("does not recommend a check when available_actions omit it", () => {
    const recs = buildRecommendations(
      [
        {
          ...base,
          status: "available",
          wipeStatus: "wiped",
          grade: "B",
          checkedDaysAgo: 200,
          availableActions: ["deployment", "disposal"],
        },
      ],
      "operate",
    );

    assert.notEqual(recs[0]?.title, "Stale device check");
    assert.ok(
      (recs[0]?.actions ?? []).every(
        (action) => action.kind !== "device_check",
      ),
    );
  });
});
