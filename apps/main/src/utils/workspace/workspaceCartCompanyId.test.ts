import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("workspaceCartCompanyId", () => {
  it("useCart resolves company id from the active workspace", () => {
    const source = readFileSync("src/hooks/useCart.ts", "utf8");
    assert.match(source, /useWorkspaceCompanyId/);
    assert.match(source, /const companyId = useWorkspaceCompanyId\(\)/);
    assert.match(source, /companyId: companyId!/);
    assert.match(source, /marketplaceItemsFromCartResponse/);
    assert.match(
      source,
      /useMemo\(\s*\(\)\s*=>\s*marketplaceItemsFromCartResponse\(cartsRes\?\.data\),\s*\[cartsRes\?\.data\],\s*\)/,
    );
  });

  it("RFQ quote acceptance refetches carts with the workspace company id", () => {
    const source = readFileSync(
      "src/container/Dashboard/Orders/CustomDeviceRequests/useCustomDeviceRequestsTable.ts",
      "utf8",
    );
    assert.match(source, /useWorkspaceCompanyId/);
    assert.match(source, /getCarts\(\{\s*companyId,\s*userId: user\.id\s*\}\)/);
  });

  it("cartApi uses the companies base path", () => {
    const source = readFileSync("src/api/baseQueries/cartApi/index.ts", "utf8");
    assert.match(source, /baseUrl: `\$\{config\.API_URL!\}\/companies`/);
  });

  for (const filePath of [
    "src/api/baseQueries/cartApi/getCarts.ts",
    "src/api/baseQueries/cartApi/addToCart.ts",
    "src/api/baseQueries/cartApi/clearCart.ts",
  ]) {
    it(`${filePath} scopes cart requests by company id`, () => {
      const source = readFileSync(filePath, "utf8");
      assert.match(source, /companyId/);
      assert.match(source, /\/\$\{companyId\}\/carts\/users\/\$\{userId\}/);
    });
  }

  it("getCarts imports UnknownCartLine from cartLineTypes", () => {
    const source = readFileSync(
      "src/api/baseQueries/cartApi/getCarts.ts",
      "utf8",
    );
    assert.match(
      source,
      /import type \{ UnknownCartLine \} from "\.\/cartLineTypes"/,
    );
  });
});
