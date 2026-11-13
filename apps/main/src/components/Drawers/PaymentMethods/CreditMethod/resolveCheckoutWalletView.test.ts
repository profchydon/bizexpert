import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveCheckoutWalletView } from "./resolveCheckoutWalletView";

const parentWallet = { available: 18500, limit: 30000 };
const ownWallet = { available: 70, limit: 100 };

describe("resolveCheckoutWalletView", () => {
  it("masks delegated billing and ignores parent or entity amounts", () => {
    assert.deepEqual(
      resolveCheckoutWalletView({
        isDelegated: true,
        isResolvingDelegated: false,
        ownWallet: parentWallet,
        dashboardWallet: parentWallet,
        isWalletLoading: false,
      }),
      { kind: "delegated" },
    );
  });

  it("shows the self-billing entity wallet, not the empty state", () => {
    assert.deepEqual(
      resolveCheckoutWalletView({
        isDelegated: false,
        isResolvingDelegated: false,
        ownWallet,
        dashboardWallet: parentWallet,
        isWalletLoading: false,
      }),
      { kind: "own", wallet: ownWallet },
    );
  });

  it("falls back to the workspace dashboard wallet for self-billing", () => {
    assert.deepEqual(
      resolveCheckoutWalletView({
        isDelegated: false,
        isResolvingDelegated: false,
        ownWallet: null,
        dashboardWallet: ownWallet,
        isWalletLoading: false,
      }),
      { kind: "own", wallet: ownWallet },
    );
  });

  it("keeps the unsubscribed empty state when billing is not delegated", () => {
    assert.deepEqual(
      resolveCheckoutWalletView({
        isDelegated: false,
        isResolvingDelegated: false,
        ownWallet: null,
        dashboardWallet: null,
        isWalletLoading: false,
      }),
      { kind: "empty" },
    );
  });

  it("stays on loading while delegated billing is unresolved", () => {
    assert.deepEqual(
      resolveCheckoutWalletView({
        isDelegated: false,
        isResolvingDelegated: true,
        ownWallet: null,
        dashboardWallet: null,
        isWalletLoading: false,
      }),
      { kind: "loading" },
    );
  });
});
