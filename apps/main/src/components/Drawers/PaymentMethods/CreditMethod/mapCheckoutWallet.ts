import { creditFacilityFromPanel } from "@/container/Dashboard/Overview/dashboardSpending";
import type { IDashboard } from "@/types/dashboard";

export type CheckoutWalletBalance = {
  available: number;
  limit: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const toAmount = (value: unknown): number | undefined => {
  if (value == null || value === "") {
    return undefined;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : undefined;
};

const readAmounts = (source: unknown): CheckoutWalletBalance | null => {
  if (!isRecord(source)) {
    return null;
  }

  const nested = isRecord(source.wallet) ? source.wallet : undefined;

  const available = toAmount(
    source.available ??
      source.balance ??
      source.current_balance ??
      nested?.available ??
      nested?.balance ??
      nested?.current_balance,
  );
  const limit = toAmount(
    source.limit ??
      source.current_limit ??
      nested?.limit ??
      nested?.current_limit,
  );

  if (available == null && limit == null) {
    return null;
  }

  return {
    available: available ?? 0,
    limit: limit ?? 0,
  };
};

export const mapCheckoutWallet = (
  source: unknown,
): CheckoutWalletBalance | null => {
  if (!isRecord(source)) {
    return null;
  }

  const nestedData = isRecord(source.data) ? source.data : undefined;

  return (
    readAmounts(source) ??
    readAmounts(nestedData) ??
    readAmounts(
      nestedData && isRecord(nestedData.data) ? nestedData.data : null,
    )
  );
};

export const checkoutWalletFromDashboard = (
  dashboard?: IDashboard | null,
): CheckoutWalletBalance | null => {
  const fromPanel = creditFacilityFromPanel(
    dashboard?.panels?.spending ?? null,
  );
  if (fromPanel.available > 0 || fromPanel.limit > 0) {
    return fromPanel;
  }

  return readAmounts(dashboard?.wallet);
};

export const checkoutWalletUsedPercent = (wallet: CheckoutWalletBalance) => {
  if (wallet.limit <= 0) {
    return 0;
  }

  const used = Math.max(0, wallet.limit - wallet.available);
  return Math.min(100, Math.round((used / wallet.limit) * 100));
};

export const isCheckoutWalletLoading = ({
  hasWallet,
  companyId,
  walletSettled,
  dashboardLoading,
}: {
  hasWallet: boolean;
  companyId?: string;
  walletSettled: boolean;
  dashboardLoading: boolean;
}) => {
  if (hasWallet) {
    return false;
  }

  if (companyId) {
    return !walletSettled;
  }

  return dashboardLoading;
};
