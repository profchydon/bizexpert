import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("marketplace cart checkout loading", () => {
  it("keeps the cart open while checkout navigation is pending", () => {
    const navBar = readFileSync(
      join(process.cwd(), "src/app/dashboard/NavBar/index.tsx"),
      "utf8",
    );
    const overview = readFileSync(
      join(
        process.cwd(),
        "src/app/dashboard/NavBar/MarketplaceCartOverview.tsx",
      ),
      "utf8",
    );
    const slideout = readFileSync(
      join(
        process.cwd(),
        "src/app/dashboard/NavBar/MarketplaceCartSlideout.tsx",
      ),
      "utf8",
    );
    const storageCheckout = readFileSync(
      join(
        process.cwd(),
        "src/app/dashboard/NavBar/useStorageActionsCheckout.ts",
      ),
      "utf8",
    );

    const marketplaceProceed = navBar.slice(
      navBar.indexOf("<MarketplaceCartOverview"),
    );
    assert.match(
      marketplaceProceed,
      /isProceedLoading=\{isCartNavigatePending\}/,
    );
    assert.doesNotMatch(
      marketplaceProceed,
      /onProceed=\{\(\) => \{[\s\S]*setIsCartOverviewOpen\(false\)/,
    );
    assert.match(overview, /useCloseCartAfterCheckoutNavigation/);
    assert.doesNotMatch(overview, /onClose\(\);\s*onProceed\(\)/);
    assert.match(slideout, /isLoading=\{isProceedLoading\}/);
    assert.match(slideout, /isDismissable=\{!isProceedLoading\}/);
    assert.doesNotMatch(storageCheckout, /onClose\(\)/);
  });
});
