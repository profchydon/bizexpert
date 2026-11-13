import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const FLOW_FILES = [
  "src/hooks/useCart.ts",
  "src/hooks/useOnboardFeeAction.tsx",
  "src/hooks/useStorageOnboardFeeAction.tsx",
  "src/hooks/useOffboardAction.tsx",
  "src/hooks/useEquipEmployeeFees.tsx",
  "src/container/Dashboard/EquipEmployee/OrderSummary/useStorageActionFees.ts",
  "src/container/Dashboard/EquipEmployee/Marketplace/ProductsLayout.tsx",
  "src/container/Dashboard/Employees/OffboardDevices/index.tsx",
  "src/container/Dashboard/Storage/Remote/hooks/useStorageServerCart.ts",
];

describe("workspaceFeesAssetsCartCompanyId", () => {
  for (const filePath of FLOW_FILES) {
    it(`${filePath} uses useWorkspaceCompanyId`, () => {
      const source = readFileSync(filePath, "utf8");
      assert.match(source, /useWorkspaceCompanyId/);
    });
  }

  it("cartApi scopes requests under /companies/{companyId}/carts", () => {
    const indexSource = readFileSync(
      "src/api/baseQueries/cartApi/index.ts",
      "utf8",
    );
    const getCartsSource = readFileSync(
      "src/api/baseQueries/cartApi/getCarts.ts",
      "utf8",
    );
    const writeSource = readFileSync(
      "src/api/baseQueries/cartApi/toStorageCartWriteItems.ts",
      "utf8",
    );

    assert.match(indexSource, /\/companies`/);
    assert.match(
      getCartsSource,
      /\/\$\{companyId\}\/carts\/users\/\$\{userId\}/,
    );
    assert.match(writeSource, /company_id: companyId/);
  });

  it("feesApi scopes requests under /companies/{companyId}/fees", () => {
    const indexSource = readFileSync(
      "src/api/baseQueries/feesApi/index.ts",
      "utf8",
    );
    const feesSource = readFileSync(
      "src/api/baseQueries/feesApi/getOnboardingboardFees.ts",
      "utf8",
    );

    assert.match(indexSource, /\/companies`/);
    assert.match(feesSource, /\/\$\{companyId\}\/fees\/onboarding/);
  });

  it("assetsApi scopes marketplace requests under /companies/{companyId}/assets", () => {
    const getAssetsSource = readFileSync(
      "src/api/baseQueries/assetsApi/getAssets.ts",
      "utf8",
    );

    assert.match(getAssetsSource, /\/companies\/\$\{companyId\}\/assets/);
  });

  for (const filePath of [
    "src/api/baseQueries/cartApi/getCarts.ts",
    "src/api/baseQueries/cartApi/addToCart.ts",
    "src/api/baseQueries/cartApi/clearCart.ts",
  ]) {
    it(`${filePath} includes companyId in request args`, () => {
      const source = readFileSync(filePath, "utf8");
      assert.match(source, /companyId/);
    });
  }
});
