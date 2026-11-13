import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import type { IDashboard } from "@/types/dashboard";
import {
  checkoutWalletFromDashboard,
  checkoutWalletUsedPercent,
  isCheckoutWalletLoading,
  mapCheckoutWallet,
} from "./mapCheckoutWallet";

const creditMethod = ["index.tsx", "useCheckoutWalletView.ts"]
  .map((file) =>
    readFileSync(
      join(
        process.cwd(),
        "src/components/Drawers/PaymentMethods/CreditMethod",
        file,
      ),
      "utf8",
    ),
  )
  .join("\n");

describe("mapCheckoutWallet", () => {
  it("reads nested dashboard wallet current_balance fields", () => {
    assert.deepEqual(
      mapCheckoutWallet({
        wallet: { current_balance: "18500", current_limit: "30000" },
      }),
      { available: 18500, limit: 30000 },
    );
  });

  it("reads spending-panel available/limit fields", () => {
    assert.deepEqual(mapCheckoutWallet({ available: "1200.5", limit: 4000 }), {
      available: 1200.5,
      limit: 4000,
    });
  });

  it("returns null when no credit amounts exist", () => {
    assert.equal(mapCheckoutWallet({ wallet_history: {} }), null);
    assert.equal(mapCheckoutWallet(undefined), null);
  });

  it("reads the original GET /wallet balance and limit from a ServerResponse", () => {
    assert.deepEqual(
      mapCheckoutWallet({
        success: true,
        data: { balance: "18500", limit: "30000" },
      }),
      { available: 18500, limit: 30000 },
    );
  });
});

describe("checkoutWalletFromDashboard", () => {
  it("prefers panels.spending.credit.wallet over the legacy wallet block", () => {
    const dashboard = {
      wallet: {
        wallet: { current_balance: "1", current_limit: "2" },
        wallet_history: {
          monthly_snapshot: [],
          quarterly_snapshot: [],
          yearly_snapshot: [],
        },
      },
      panels: {
        spending: {
          credit: { wallet: { available: 18500, limit: 30000 } },
        },
      },
    } as unknown as IDashboard;

    assert.deepEqual(checkoutWalletFromDashboard(dashboard), {
      available: 18500,
      limit: 30000,
    });
  });

  it("falls back to the legacy dashboard wallet when spending credit is empty", () => {
    const dashboard = {
      wallet: {
        wallet: { current_balance: "70", current_limit: "100" },
        wallet_history: {
          monthly_snapshot: [],
          quarterly_snapshot: [],
          yearly_snapshot: [],
        },
      },
    } as unknown as IDashboard;

    assert.deepEqual(checkoutWalletFromDashboard(dashboard), {
      available: 70,
      limit: 100,
    });
  });
});

describe("checkoutWalletUsedPercent", () => {
  it("returns the used share of the limit", () => {
    assert.equal(
      checkoutWalletUsedPercent({ available: 18500, limit: 30000 }),
      38,
    );
    assert.equal(checkoutWalletUsedPercent({ available: 10, limit: 0 }), 0);
  });
});

describe("isCheckoutWalletLoading", () => {
  it("stops waiting once the wallet query settles even if dashboard is still loading", () => {
    assert.equal(
      isCheckoutWalletLoading({
        hasWallet: false,
        companyId: "company-1",
        walletSettled: true,
        dashboardLoading: true,
      }),
      false,
    );
  });

  it("keeps loading only while the wallet query is in flight", () => {
    assert.equal(
      isCheckoutWalletLoading({
        hasWallet: false,
        companyId: "company-1",
        walletSettled: false,
        dashboardLoading: false,
      }),
      true,
    );
  });
});

describe("CreditMethod wallet loading", () => {
  it("skips the wallet query until a company id exists and maps the full wallet response", () => {
    assert.match(creditMethod, /useWorkspaceDashboardQuery/);
    assert.match(creditMethod, /skip: !companyId \|\| isDelegated/);
    assert.match(creditMethod, /checkoutWalletFromDashboard/);
    assert.match(creditMethod, /mapCheckoutWallet\(walletQuery\.data\)/);
    assert.match(creditMethod, /isCheckoutWalletLoading/);
    assert.match(creditMethod, /const view = useCheckoutWalletView\(\)/);
    assert.match(creditMethod, /CheckoutWalletCard/);
    assert.doesNotMatch(creditMethod, /bg-opacity-30/);
    assert.doesNotMatch(creditMethod, /wallet\?\.balance/);
  });

  it("loads GET /wallet for the active workspace company, not the parent auth company", () => {
    assert.match(creditMethod, /useWorkspaceCompanyId/);
    assert.doesNotMatch(creditMethod, /useAuthUserDetail/);
    assert.doesNotMatch(creditMethod, /getCompanyDetails/);
  });
});
