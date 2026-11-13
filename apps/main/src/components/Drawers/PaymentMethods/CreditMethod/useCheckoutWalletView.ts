import { useGetWalletQuery } from "@/api/baseQueries/companiesApi/walletApi/getWallet";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useWorkspaceDashboardQuery } from "@/hooks/useWorkspaceDashboardQueries";
import {
  checkoutWalletFromDashboard,
  isCheckoutWalletLoading,
  mapCheckoutWallet,
} from "./mapCheckoutWallet";
import {
  resolveCheckoutWalletView,
  type CheckoutWalletView,
} from "./resolveCheckoutWalletView";
import { useCheckoutDelegatedBilling } from "./useCheckoutDelegatedBilling";

export function useCheckoutWalletView(): CheckoutWalletView {
  const companyId = useWorkspaceCompanyId();
  const { isDelegated, isResolving } = useCheckoutDelegatedBilling();
  const dashboardQuery = useWorkspaceDashboardQuery({ skip: isDelegated });
  const walletQuery = useGetWalletQuery(
    { companyId: companyId ?? "" },
    { skip: !companyId || isDelegated },
  );

  const ownWallet = mapCheckoutWallet(walletQuery.data);
  const dashboardWallet = isDelegated
    ? null
    : checkoutWalletFromDashboard(dashboardQuery.data?.data);

  return resolveCheckoutWalletView({
    isDelegated,
    isResolvingDelegated: isResolving,
    ownWallet,
    dashboardWallet,
    isWalletLoading: isCheckoutWalletLoading({
      hasWallet: Boolean(ownWallet || dashboardWallet),
      companyId,
      walletSettled: walletQuery.isSuccess || walletQuery.isError,
      dashboardLoading: dashboardQuery.isLoading,
    }),
  });
}
