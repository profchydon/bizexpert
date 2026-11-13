import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("storage device action flow", () => {
  it("loads storage service fees from the API", () => {
    const hook = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/hooks/useStorageServiceFeesState.ts",
      ),
      "utf8",
    );
    const fees = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/utils/storageServiceFees.ts",
      ),
      "utf8",
    );

    assert.match(hook, /useGetServiceFeesQuery/);
    assert.match(hook, /refetchOnMountOrArgChange/);
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/Storage/Remote/hooks/StorageServiceFeesProvider.tsx",
        ),
        "utf8",
      ),
      /StorageServiceFeesProvider/,
    );
    assert.match(fees, /normalizeServiceFeeResponse/);
    assert.match(fees, /Reassignment/);
    assert.match(fees, /Device_Check/);
    assert.match(fees, /Dispose/);
  });

  it("routes storage-only proceed to checkout through equip-employee order summary", () => {
    const overview = readFileSync(
      join(
        process.cwd(),
        "src/app/dashboard/NavBar/MarketplaceCartOverview.tsx",
      ),
      "utf8",
    );

    assert.match(overview, /useStorageActionsCheckout/);
    assert.match(overview, /proceedToOrderSummary\(actionItems, feeTable\)/);
    assert.doesNotMatch(overview, /storageUnifiedCheckout/);
  });

  it("uses the design-ui cart slideout layout for storage actions", () => {
    const storageCartOverview = readFileSync(
      join(
        process.cwd(),
        "src/app/dashboard/NavBar/StorageActionsCartOverview.tsx",
      ),
      "utf8",
    );
    const cartActions = readFileSync(
      join(process.cwd(), "src/app/dashboard/NavBar/CartActionsSection.tsx"),
      "utf8",
    );

    assert.match(storageCartOverview, /in your cart/);
    assert.match(storageCartOverview, /link-gray/);
    assert.match(storageCartOverview, /iconTrailing={ArrowRight}/);
    assert.match(storageCartOverview, /cartSubtotalLabel/);
    assert.match(cartActions, /CheckoutItemRow/);
    assert.match(cartActions, /divide-y divide-secondary/);
  });

  it("uses the design-ui cart slideout layout for marketplace products", () => {
    const slideout = readFileSync(
      join(
        process.cwd(),
        "src/app/dashboard/NavBar/MarketplaceCartSlideout.tsx",
      ),
      "utf8",
    );
    const item = readFileSync(
      join(process.cwd(), "src/app/dashboard/NavBar/CartSlideoutItem.tsx"),
      "utf8",
    );

    assert.match(slideout, /in your cart/);
    assert.match(slideout, /link-gray/);
    assert.match(slideout, /iconTrailing={ArrowRight}/);
    assert.match(slideout, /Continue shopping/);
    assert.match(slideout, /CartCountryHeader/);
    assert.match(slideout, /CartSlideoutItem/);
    assert.doesNotMatch(slideout, /ProceedDropup/);
    assert.doesNotMatch(slideout, /DrawerRight/);
    assert.match(item, /Trash02/);
    assert.match(item, /border-secondary bg-secondary/);
  });
});
