import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("cart domain isolation wiring", () => {
  it("isolates storage and marketplace carts in the navbar", () => {
    const navBar = readFileSync(
      join(process.cwd(), "src/app/dashboard/NavBar/index.tsx"),
      "utf8",
    );
    const hook = readFileSync(
      join(process.cwd(), "src/app/dashboard/NavBar/useCartDomainIsolation.ts"),
      "utf8",
    );

    const unifiedCart = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/hooks/useUnifiedCart.ts",
      ),
      "utf8",
    );

    assert.match(navBar, /useCartDomainIsolation/);
    assert.match(hook, /shouldClearMarketplaceCart/);
    assert.match(hook, /shouldClearStorageCart/);
    assert.match(hook, /removeAllItemsFromCart/);
    assert.match(hook, /clearStorageActionsCart\(storageCartItems, true\)/);
    assert.match(unifiedCart, /isolateCartItems/);
    assert.match(unifiedCart, /useStorageServerCart/);
    assert.doesNotMatch(unifiedCart, /localItems/);
    assert.doesNotMatch(unifiedCart, /\.\.\.deployments/);
  });
});
