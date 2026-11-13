import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");
const dir = "src/container/Dashboard/EquipEmployee/Marketplace/ProductDetails";

describe("marketplace product details page", () => {
  it("wires Details with cart, delivery, and spec selection props", () => {
    const page = read(`${dir}/index.tsx`);
    const hook = read(`${dir}/useMarketplaceProductDetails.ts`);

    assert.match(page, /useMarketplaceProductDetails/);
    assert.match(page, /<Details \{\.\.\.detailsProps\} \/>/);
    assert.match(hook, /deliveryEstimate: resolveDeliveryEstimate/);
    assert.match(hook, /handleAddToCart/);
    assert.match(hook, /onSelectSpec:/);
  });

  it("uses existing specification modules in the body", () => {
    const body = read(`${dir}/ProductDetailsBody.tsx`);
    const table = read(`${dir}/TechnicalSpecificationsTable.tsx`);

    assert.match(
      body,
      /import SpecificationOptions from "\.\/SpecificationOptions"/,
    );
    assert.match(body, /toSpecificationRows|TechnicalSpecificationsTable/);
    assert.match(table, /toSpecificationRows/);
  });
});
