import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const read = (file: string) =>
  readFileSync(join(process.cwd(), "src/app/dashboard/NavBar", file), "utf8");

describe("plan savings on cart surfaces", () => {
  it("mounts a compact callout under the cart popup subtotal", () => {
    const popup = read("CartPopup.tsx");
    assert.match(popup, /PlanSavingsCallout/);
    assert.match(popup, /variant="compact"/);
    assert.match(popup, /readSubscriberSaving/);
    assert.doesNotMatch(popup, /showCompareLink/);
  });

  it("mounts a card callout on the marketplace cart drawer", () => {
    const slideout = read("MarketplaceCartSlideout.tsx");
    const overview = read("MarketplaceCartOverview.tsx");
    assert.match(slideout, /PlanSavingsCallout/);
    assert.match(slideout, /variant="card"/);
    assert.match(overview, /savings=\{savings\}/);
  });
});
