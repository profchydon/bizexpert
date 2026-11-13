import assert from "node:assert/strict";
import { test } from "node:test";
import {
  LOCATION_STAFF_PERMISSIONS,
  locationStaffPermissionLabel,
} from "./locationStaffPermissions";

test("locationStaffPermissionLabel covers every permission", () => {
  for (const item of LOCATION_STAFF_PERMISSIONS) {
    assert.equal(locationStaffPermissionLabel(item.key), item.label);
  }
});
