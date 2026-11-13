import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  canShowOrderingForBanner,
  resolveOrderingForTarget,
} from "./orderingForTarget";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");
const dir = "src/container/Dashboard/EquipEmployee/Marketplace";

describe("orderingForBanner", () => {
  it("shows the banner for a global admin or more than one entity", () => {
    assert.equal(canShowOrderingForBanner(true, 1), true);
    assert.equal(canShowOrderingForBanner(false, 2), true);
    assert.equal(canShowOrderingForBanner(false, 1), false);
  });

  it("names the office with its country flag and the owner's billing currency", () => {
    assert.deepEqual(
      resolveOrderingForTarget({
        officeName: "Lagos HQ",
        officeCountryCode: "ng",
        officeCurrency: "NGN",
        isGlobalWorkspace: true,
        companyName: "Rayda Inc",
        companyCurrency: "USD",
        companyCountryCode: "US",
        entityCurrency: "usd",
      }),
      { name: "Lagos HQ", currency: "USD", countryCode: "NG" },
    );
  });

  it("falls back to the office currency when the owner has none", () => {
    assert.equal(
      resolveOrderingForTarget({
        officeName: "Lagos HQ",
        officeCountryCode: "NG",
        officeCurrency: "ngn",
        isGlobalWorkspace: false,
      }).currency,
      "NGN",
    );
  });

  it("uses the primary company on the global workspace", () => {
    assert.deepEqual(
      resolveOrderingForTarget({
        isGlobalWorkspace: true,
        companyName: "Rayda Inc",
        companyCurrency: "usd",
        companyCountryCode: "us",
        entityName: "Rayda UK",
        entityCurrency: "GBP",
        entityCountryCode: "GB",
      }),
      { name: "Rayda Inc", currency: "USD", countryCode: "US" },
    );
  });

  it("uses the active entity when the workspace is an entity", () => {
    assert.deepEqual(
      resolveOrderingForTarget({
        isGlobalWorkspace: false,
        companyName: "Rayda Inc",
        companyCurrency: "USD",
        companyCountryCode: "US",
        entityName: "Rayda UK",
        entityCurrency: "gbp",
        entityCountryCode: "gb",
      }),
      { name: "Rayda UK", currency: "GBP", countryCode: "GB" },
    );
  });

  it("places the ordering row under the toolbar and styles it like design-ui", () => {
    const main = read(`${dir}/MarketplaceMainContent.tsx`);
    const page = read(`${dir}/index.tsx`);
    const row = read(`${dir}/MarketplaceContextRow.tsx`);
    const banner = read(`${dir}/OrderingForBanner.tsx`);

    assert.doesNotMatch(page, /<MarketplaceContextRow/);
    assert.match(main, /<MarketplaceToolbar/);
    assert.match(main, /bg-border-secondary/);
    assert.match(main, /<MarketplaceContextRow/);
    assert.match(row, /<OrderingForBanner/);
    assert.match(row, /<LocalTimeBanner/);
    assert.match(banner, /border-brand-200 bg-brand-50/);
    assert.match(banner, /text-brand-secondary/);
    assert.match(banner, /Ordering for/);
    assert.match(banner, /Billed in/);
  });
});
