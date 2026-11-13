import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { assetVaultTabHref, resolveAssetVaultTab } from "./assetVaultTab";

const params = (query: Record<string, string>) =>
  ({
    get: (key: string) => query[key] ?? null,
  }) as Pick<URLSearchParams, "get">;

describe("resolveAssetVaultTab", () => {
  it("selects refresh when device-refresh is true", () => {
    assert.equal(
      resolveAssetVaultTab(params({ "device-refresh": "true" })),
      "refresh",
    );
  });

  it("selects archived from tab query param", () => {
    assert.equal(resolveAssetVaultTab(params({ tab: "archived" })), "archived");
  });

  it("defaults to equipment", () => {
    assert.equal(resolveAssetVaultTab(params({})), "equipment");
  });
});

describe("assetVaultTabHref", () => {
  it("builds URLs for each tab", () => {
    assert.equal(assetVaultTabHref("equipment"), "/dashboard/all-equipments");
    assert.equal(
      assetVaultTabHref("archived"),
      "/dashboard/all-equipments?tab=archived",
    );
    assert.equal(
      assetVaultTabHref("refresh"),
      "/dashboard/all-equipments?device-refresh=true",
    );
  });

  it("keeps the active entity on every tab href", () => {
    assert.equal(
      assetVaultTabHref("equipment", "entity-11"),
      "/dashboard/all-equipments?entity=entity-11",
    );
    assert.equal(
      assetVaultTabHref("archived", "entity-11"),
      "/dashboard/all-equipments?tab=archived&entity=entity-11",
    );
    assert.equal(
      assetVaultTabHref("refresh", "entity-11"),
      "/dashboard/all-equipments?device-refresh=true&entity=entity-11",
    );
  });

  it("Asset Vault navigation passes the active entity into tab hrefs", () => {
    const page = readFileSync(
      new URL("./AllEquipment.tsx", import.meta.url),
      "utf8",
    );
    assert.match(page, /useActiveWorkspace/);
    assert.match(page, /assetVaultTabHref\("equipment", activeEntityId\)/);
    assert.match(page, /assetVaultTabHref\(tab, activeEntityId\)/);
  });
});
