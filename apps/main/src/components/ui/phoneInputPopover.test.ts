import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DRAWER_RIGHT_DEFAULT_Z_INDEX,
  PHONE_COUNTRY_POPOVER_Z_CLASS,
  PHONE_COUNTRY_POPOVER_Z_INDEX,
  phoneCountryPopoverSitsAboveDrawer,
} from "./phoneInputPopover";

describe("phoneCountryPopoverSitsAboveDrawer", () => {
  it("sits above the default Edit employees drawer", () => {
    assert.equal(DRAWER_RIGHT_DEFAULT_Z_INDEX, 1007);
    assert.equal(PHONE_COUNTRY_POPOVER_Z_INDEX, 100000);
    assert.equal(PHONE_COUNTRY_POPOVER_Z_CLASS, "z-[100000]");
    assert.equal(phoneCountryPopoverSitsAboveDrawer(), true);
  });

  it("fails when the popover is below the drawer", () => {
    assert.equal(phoneCountryPopoverSitsAboveDrawer(1007, 1000), false);
  });
});
