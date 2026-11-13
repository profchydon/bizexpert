import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("storage cart API wiring", () => {
  it("adds storage action lines through the user cart with workspace company id", () => {
    const actions = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/hooks/useStorageCartActions.ts",
      ),
      "utf8",
    );
    const post = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/hooks/postStorageCartItems.ts",
      ),
      "utf8",
    );
    const serverCart = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/hooks/useStorageServerCart.ts",
      ),
      "utf8",
    );

    assert.match(actions, /postStorageCartItems\(items\)/);
    assert.doesNotMatch(actions, /addCheckoutItems/);
    assert.match(post, /getCartSessionAuth/);
    assert.match(post, /toStorageCartWriteItems\(items, companyId\)/);
    assert.match(post, /storageCartItemsToPost\(writeItems, cart\?\.data\)/);
    assert.match(post, /companyId,/);
    assert.match(post, /addToCartApi\.endpoints\.addToCart\.initiate/);
    assert.match(serverCart, /useWorkspaceCompanyId/);
    assert.match(serverCart, /companyId: companyId!/);
    assert.match(serverCart, /filterStorageCartLinesForCompany/);
    assert.match(serverCart, /mapStorageCartLineToCheckoutItem/);
  });

  it("clears the queued-requests cart with DELETE /carts/users/{user}", () => {
    const slideout = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/components/cart/StorageActionCartSlideout.tsx",
      ),
      "utf8",
    );
    const helper = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/hooks/clearAllStorageCart.ts",
      ),
      "utf8",
    );
    const api = readFileSync(
      join(process.cwd(), "src/api/baseQueries/cartApi/clearCart.ts"),
      "utf8",
    );

    assert.match(slideout, /clearAllStorageCart\(\)/);
    assert.doesNotMatch(slideout, /removeAllProductsFromCart/);
    assert.doesNotMatch(slideout, /useUnifiedCart/);
    assert.match(helper, /clearCartApi\.endpoints\.clearCart\.initiate/);
    assert.match(helper, /omitWorkspaceStorageCartLines/);
    assert.match(api, /method: "DELETE"/);
    assert.match(api, /\/\$\{companyId\}\/carts\/users\/\$\{userId\}/);
  });

  it("clears the storage-only navbar cart with the same DELETE", () => {
    const overview = readFileSync(
      join(
        process.cwd(),
        "src/app/dashboard/NavBar/MarketplaceCartOverview.tsx",
      ),
      "utf8",
    );
    const actionsIf = overview.indexOf("if (actionsOnly)");
    const firstReturn = overview.indexOf("return (", actionsIf);
    const secondReturn = overview.indexOf("return (", firstReturn + 1);
    const actionsOnly = overview.slice(actionsIf, secondReturn);

    assert.match(
      actionsOnly,
      /onClearCart=\{\(\) => clearAllStorageCart\(\)\}/,
    );
    assert.doesNotMatch(
      actionsOnly,
      /clearStorageActionsCart\(actionItems, true\)/,
    );
  });

  it("queues storage page actions through workspace-aware cart helpers", () => {
    const page = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/StoragePage.tsx",
      ),
      "utf8",
    );
    const flow = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/hooks/useStoragePageCartFlow.ts",
      ),
      "utf8",
    );

    assert.match(page, /useStoragePageCartFlow/);
    assert.match(flow, /toDeviceCheckCartItem/);
    assert.match(flow, /toDisposeCartItem/);
    assert.match(flow, /toDeployCartItem/);
    assert.match(flow, /queueStorageCartAction/);
  });

  it("resolves cart session company id from the active workspace", () => {
    const source = readFileSync(
      join(process.cwd(), "src/api/baseQueries/cartApi/getCartSessionAuth.ts"),
      "utf8",
    );

    assert.match(source, /resolveWorkspaceApiCompanyId/);
    assert.match(source, /workspaceScope\.activeEntityId/);
    assert.match(source, /user\?\.id/);
  });
});
