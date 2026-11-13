import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

const MARKETPLACE = "src/container/Dashboard/EquipEmployee/Marketplace";

describe("marketplace-ui type declarations", () => {
  it("declares the package so next build can type-check imports", () => {
    const types = read("src/types/marketplace-ui.d.ts");

    assert.match(types, /declare module "@raydahq\/marketplace-ui"/);
    assert.match(types, /export interface MarketplaceProduct/);
    assert.match(types, /export interface MarketplaceSpecification/);
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
