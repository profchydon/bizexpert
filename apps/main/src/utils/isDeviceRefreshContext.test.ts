import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildDeviceRefreshMarketplaceHref,
  hasDeviceRefreshReduxState,
  isDeviceRefreshContext,
  isDeviceRefreshSearchParam,
  shouldBlockAssignmentFlowForDeviceRefresh,
} from "./isDeviceRefreshContext";
import routes from "@/routes";

const params = (values: Record<string, string>) => ({
  get: (key: string) => values[key] ?? null,
});

describe("isDeviceRefreshSearchParam", () => {
  it("returns true only for device-refresh=true", () => {
    assert.equal(
      isDeviceRefreshSearchParam(params({ "device-refresh": "true" })),
      true,
    );
    assert.equal(
      isDeviceRefreshSearchParam(params({ "device-refresh": "false" })),
      false,
    );
    assert.equal(isDeviceRefreshSearchParam(null), false);
  });
});

describe("hasDeviceRefreshReduxState", () => {
  it("detects selected equipment or refresh device items", () => {
    assert.equal(
      hasDeviceRefreshReduxState({
        persistedReducers: { equipEmployee: { selectedEquipment: [{}] } },
      }),
      true,
    );
    assert.equal(
      hasDeviceRefreshReduxState({
        persistedReducers: {
          equipEmployee: { selectedEquipment: { id: "asset-1" } },
        },
      }),
      true,
    );
    assert.equal(
      hasDeviceRefreshReduxState({
        persistedReducers: { equipEmployee: { refreshDeviceItems: [{}] } },
      }),
      true,
    );
    assert.equal(hasDeviceRefreshReduxState({}), false);
  });
});

describe("shouldBlockAssignmentFlowForDeviceRefresh", () => {
  it("blocks assignment flow only when device-refresh=true is present", () => {
    assert.equal(
      shouldBlockAssignmentFlowForDeviceRefresh(
        params({ "device-refresh": "true" }),
      ),
      true,
    );
    assert.equal(shouldBlockAssignmentFlowForDeviceRefresh(params({})), false);
  });

  it("does not block assignment flow for stale redux-only refresh state", () => {
    assert.equal(shouldBlockAssignmentFlowForDeviceRefresh(params({})), false);
  });
});

describe("isDeviceRefreshContext", () => {
  it("combines search param and redux signals", () => {
    assert.equal(
      isDeviceRefreshContext(params({ "device-refresh": "true" }), {}),
      true,
    );
    assert.equal(
      isDeviceRefreshContext(params({}), {
        persistedReducers: { equipEmployee: { refreshDeviceItems: [{}] } },
      }),
      true,
    );
    assert.equal(isDeviceRefreshContext(params({}), {}), false);
  });
});

describe("buildDeviceRefreshMarketplaceHref", () => {
  it("preserves single-instance in the marketplace link", () => {
    assert.equal(
      buildDeviceRefreshMarketplaceHref(
        params({ "device-refresh": "true", "single-instance": "true" }),
      ),
      `${routes.EQUIP_EMPLOYEE_MARKETPLACE}?device-refresh=true&single-instance=true`,
    );
  });
});
