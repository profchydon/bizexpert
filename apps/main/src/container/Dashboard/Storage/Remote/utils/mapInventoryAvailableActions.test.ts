import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapInventoryAvailableActions } from "./mapInventoryAvailableActions";

const offboardingActions = [
  {
    type: "storage_device_check",
    label: "Device check",
    allowed: false,
    reason: "device_check_buy_to_storage_only",
    message:
      "Device checks can only be requested for buy-to-storage equipment.",
  },
  {
    type: "storage_disposal",
    label: "Request disposal",
    allowed: true,
    reason: null,
    message: null,
  },
  {
    type: "storage_deploy_to_employee",
    label: "Deploy to employee",
    allowed: true,
    reason: null,
    message: null,
  },
];

describe("mapInventoryAvailableActions", () => {
  it("prefers available_actions and keeps the row-menu order", () => {
    assert.deepEqual(
      mapInventoryAvailableActions(
        [
          "storage_device_check",
          "storage_disposal",
          "storage_deploy_to_employee",
        ],
        offboardingActions,
      ),
      ["deployment", "device_check", "disposal"],
    );
  });

  it("omits device check when it is not in available_actions", () => {
    assert.deepEqual(
      mapInventoryAvailableActions(
        ["storage_disposal", "storage_deploy_to_employee"],
        offboardingActions,
      ),
      ["deployment", "disposal"],
    );
  });

  it("falls back to allowed action rows when available_actions is missing", () => {
    assert.deepEqual(
      mapInventoryAvailableActions(undefined, offboardingActions),
      ["deployment", "disposal"],
    );
  });

  it("keeps an empty list so status fallback does not restore actions", () => {
    assert.deepEqual(mapInventoryAvailableActions([], offboardingActions), []);
  });

  it("returns undefined when the API omitted both fields", () => {
    assert.equal(mapInventoryAvailableActions(), undefined);
  });
});
