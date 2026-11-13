import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("NavBar action order", () => {
  it("renders search, changelog, cart, portals, and account in that order", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/dashboard/NavBar/index.tsx"),
      "utf8",
    );

    const searchIndex = source.indexOf("<NavSearchButton");
    const changelogIndex = source.indexOf("<NavChangelogButton");
    const cartIndex = source.indexOf("<NavCartControl");
    const portalIndex = source.indexOf("<NavPortalSwitcher");
    const accountIndex = source.indexOf("<NavSetting");

    assert.ok(searchIndex >= 0);
    assert.ok(changelogIndex >= 0);
    assert.ok(cartIndex >= 0);
    assert.ok(accountIndex >= 0);
    assert.ok(searchIndex < changelogIndex);
    assert.ok(changelogIndex < cartIndex);
    assert.ok(cartIndex < portalIndex);
    assert.ok(portalIndex < accountIndex);
    assert.equal(source.includes("NavNotificationsBell"), false);
  });
});
