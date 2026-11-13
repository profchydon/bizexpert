import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolvePlanTier } from "../../../Accounts/utils/planTier";
import {
  OPEN_FLEET_COMING_SOON_REASON,
  OPEN_FLEET_UPGRADE_REASON,
  canUseOpenFleet,
  openFleetImportDisabledReason,
} from "./openFleetAccess";

describe("canUseOpenFleet", () => {
  it("blocks Free and Procure", () => {
    assert.equal(canUseOpenFleet(resolvePlanTier("Procure")), false);
    assert.equal(canUseOpenFleet(resolvePlanTier("Free")), false);
    assert.equal(canUseOpenFleet(resolvePlanTier("Free Procure")), false);
  });

  it("unlocks Manage, Operate, and Scale", () => {
    assert.equal(canUseOpenFleet(resolvePlanTier("Manage")), true);
    assert.equal(canUseOpenFleet(resolvePlanTier("Operate")), true);
    assert.equal(canUseOpenFleet(resolvePlanTier("Scale Annual")), true);
  });
});

describe("openFleetImportDisabledReason", () => {
  it("asks Procure to upgrade instead of Coming soon", () => {
    assert.equal(
      openFleetImportDisabledReason(resolvePlanTier("Procure")),
      OPEN_FLEET_UPGRADE_REASON,
    );
  });

  it("keeps Coming soon when the plan already includes Open Fleet", () => {
    assert.equal(
      openFleetImportDisabledReason(resolvePlanTier("Manage")),
      OPEN_FLEET_COMING_SOON_REASON,
    );
  });
});
