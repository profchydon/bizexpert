import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

const MARKETPLACE = "src/container/Dashboard/EquipEmployee/Marketplace";

describe("local marketplace UI", () => {
  it("vendors product, filter, and empty-state UI without GitHub Packages", () => {
    const types = read("src/components/marketplace/types.ts");
    const barrel = read("src/components/marketplace/index.ts");
    const products = read(`${MARKETPLACE}/MarketplaceProductsSection.tsx`);
    const details = read(`${MARKETPLACE}/ProductDetails/Details.tsx`);
    const filters = read(`${MARKETPLACE}/FilterActions/index.tsx`);
    const mapper = read(`${MARKETPLACE}/utils/mapAssetToMarketplaceProduct.ts`);
    const styles = read("src/styles/globals.css");
    const pkg = read("package.json");

    assert.match(types, /export interface MarketplaceProduct/);
    assert.match(types, /export interface MarketplaceSpecification/);
    assert.match(barrel, /export \{ FilterPanel \}/);
    assert.match(barrel, /export \{ ProductCard \}/);
    assert.match(barrel, /export \{ ProductDetail \}/);
    assert.match(products, /from "@\/components\/marketplace"/);
    assert.match(details, /from "@\/components\/marketplace"/);
    assert.match(filters, /from "@\/components\/marketplace"/);
    assert.match(mapper, /from "@\/components\/marketplace"/);
    assert.match(styles, /@import "\.\/marketplace-ui.css"/);
    assert.doesNotMatch(pkg, /@raydahq\/marketplace-ui/);
    assert.doesNotMatch(products, /@raydahq\/marketplace-ui/);
    assert.doesNotMatch(details, /@raydahq\/marketplace-ui/);
    assert.doesNotMatch(filters, /@raydahq\/marketplace-ui/);
    assert.doesNotMatch(mapper, /@raydahq\/marketplace-ui/);
  });
});

describe("MarketplaceMainContent product section wiring", () => {
  it("forwards cart actions and does not pass setIsLoading", () => {
    const source = read(`${MARKETPLACE}/MarketplaceMainContent.tsx`);

    assert.match(source, /<MarketplaceProductsSection/);
    assert.match(source, /\{\.\.\.productsSectionProps\}/);
    assert.match(source, /onClearFilters=\{onResetDesktopFilter\}/);
    assert.doesNotMatch(source, /setIsLoading/);
  });

  it("types FilterPanel price callbacks so next build stays strict", () => {
    const filters = read(`${MARKETPLACE}/FilterActions/index.tsx`);

    assert.match(filters, /setMinPriceValue: \(value: string \| number\) =>/);
    assert.match(filters, /setMaxPriceValue: \(value: string \| number\) =>/);
  });

  it("accepts the layout cart and country selector props", () => {
    const props = read(`${MARKETPLACE}/marketplaceMainContentProps.ts`);
    const layout = read(`${MARKETPLACE}/ProductsLayout.tsx`);
    const toolbar = read(`${MARKETPLACE}/MarketplaceToolbar.tsx`);

    assert.match(
      props,
      /Omit<\s*MarketplaceProductsSectionProps,\s*"onClearFilters"\s*>/,
    );
    assert.match(layout, /carts=\{carts\}/);
    assert.match(layout, /onAddToCart=/);
    assert.match(layout, /countrySelectorSlot=/);
    assert.match(
      toolbar,
      /countrySelectorSlot \?\? <MarketplaceCountrySelector \/>/,
    );
  });
});
