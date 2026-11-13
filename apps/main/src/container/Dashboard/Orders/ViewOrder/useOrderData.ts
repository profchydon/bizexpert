import { useMemo } from "react";
import { useGetOrderQuery } from "@/api/baseQueries/companiesApi/ordersApi/getOrder";
import { ISubOrder } from "@/types/orders";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { currencySymbol } from "@/utils/currencySymbol";
import { hasVerifiableAssetOrder } from "./verificationUtils";
import { NON_UPDATABLE_STATUSES } from "./orderSignatureRules";

/**
 * The order API sends `currency` (on the order and each sub-order) as a display
 * string that should be a symbol, but some currencies come through as an ISO
 * code (e.g. "GBP"). Normalize both to a symbol here — the single point every
 * downstream total, table, modal and slideout reads from — so the whole order
 * detail view renders symbols regardless of what the backend stored. The
 * resolver is idempotent, so values that are already symbols are untouched.
 */
const normalizeOrderCurrency = <T extends { currency?: string } | undefined>(
  order: T,
): T => {
  if (!order) {
    return order;
  }

  const rawSubOrders = (order as any).sub_orders;
  const subOrdersList = Array.isArray(rawSubOrders)
    ? rawSubOrders
    : rawSubOrders?.data;

  let normalizedSubOrders = rawSubOrders;
  if (Array.isArray(subOrdersList)) {
    const mapped = subOrdersList.map((sub: any) =>
      sub && typeof sub === "object" && "currency" in sub
        ? { ...sub, currency: currencySymbol(sub.currency) }
        : sub,
    );
    normalizedSubOrders = Array.isArray(rawSubOrders)
      ? mapped
      : { ...rawSubOrders, data: mapped };
  }

  return {
    ...order,
    currency: currencySymbol(order.currency),
    sub_orders: normalizedSubOrders,
  } as T;
};

interface Params {
  orderId: string;
}

const useOrderData = ({ orderId }: Params) => {
  const companyId = useWorkspaceCompanyId();

  const {
    data: orderDetailRes,
    isLoading,
    isError,
    refetch,
  } = useGetOrderQuery(
    { companyId, orderId },
    { skip: !companyId || !orderId },
  );

  const order = useMemo(
    () => normalizeOrderCurrency(orderDetailRes?.data),
    [orderDetailRes],
  );

  const subOrders = useMemo<ISubOrder[]>(() => {
    if (!order?.sub_orders) return [];
    return Array.isArray(order.sub_orders)
      ? order.sub_orders
      : (order.sub_orders as any)?.data || [];
  }, [order]);

  const pendingVerificationSubOrders = useMemo(
    () =>
      subOrders.filter(
        (sub) =>
          sub?.status?.toLowerCase() === "verification_pending" &&
          hasVerifiableAssetOrder(sub),
      ),
    [subOrders],
  );

  const orderStatusLower = order?.status?.toLowerCase() || "";
  const isOrderStatusLocked = NON_UPDATABLE_STATUSES.includes(orderStatusLower);

  const canUpdateSignature = useMemo(() => {
    if (!subOrders.length) return false;
    if (NON_UPDATABLE_STATUSES.includes(orderStatusLower)) return false;
    return subOrders.some((sub) => {
      const statusLower = sub.status?.toLowerCase() || "";
      return !NON_UPDATABLE_STATUSES.includes(statusLower);
    });
  }, [subOrders, orderStatusLower]);

  return {
    companyId,
    order,
    subOrders,
    pendingVerificationSubOrders,
    orderStatusLower,
    isOrderStatusLocked,
    canUpdateSignature,
    isLoading,
    isError,
    refetch,
  };
};

export default useOrderData;
