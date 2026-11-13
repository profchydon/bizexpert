import type { CheckoutWalletBalance } from "./mapCheckoutWallet";

export type CheckoutWalletView =
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "own"; wallet: CheckoutWalletBalance }
  | { kind: "delegated" };

export function resolveCheckoutWalletView({
  isDelegated,
  isResolvingDelegated,
  ownWallet,
  dashboardWallet,
  isWalletLoading,
}: {
  isDelegated: boolean;
  isResolvingDelegated: boolean;
  ownWallet: CheckoutWalletBalance | null;
  dashboardWallet: CheckoutWalletBalance | null;
  isWalletLoading: boolean;
}): CheckoutWalletView {
  if (isDelegated) {
    return { kind: "delegated" };
  }

  if (isResolvingDelegated || isWalletLoading) {
    return { kind: "loading" };
  }

  if (ownWallet) {
    return { kind: "own", wallet: ownWallet };
  }

  if (dashboardWallet) {
    return { kind: "own", wallet: dashboardWallet };
  }

  return { kind: "empty" };
}
