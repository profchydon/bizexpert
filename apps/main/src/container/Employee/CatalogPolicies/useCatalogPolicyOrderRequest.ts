import { useCreateCatalogPolicyOrderRequestMutation } from "@/api/baseQueries/companiesApi/employeesApi/createCatalogPolicyOrderRequest";
import { useGetEmployeeDashboardQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployeeDashboard";
import { orderRequestToRecord } from "@/container/Dashboard/Approvals/apiAdapters";
import {
  extractPrimaryApprovalTier,
  trackApprovalQueued,
} from "@/lib/approvalAnalytics";
import { trackEmployeeOrderSubmitted } from "@/lib/employeePortalAnalytics";
import type { CatalogOrderRequestApi } from "@/types/catalogPolicyOrderRequest";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { usePathname, useRouter } from "next/navigation";
import { getEmployeeCatalogPolicyIdFromPathname } from "./catalogPolicyPath";
import { catalogPolicyDetailTabs } from "./catalogPolicyTabs";
import { useCatalogPolicyCart } from "./CatalogPolicyCartContext";
import { buildPolicyOrderRequestPayload } from "./CatalogPolicyDetail/utils";
import {
  approvedCatalogPolicyOrderMessage,
  pendingCatalogPolicyOrderMessage,
} from "./pendingOrder";
import { usePendingCatalogPolicyOrder } from "./usePendingCatalogPolicyOrder";

export const useCatalogPolicyOrderRequest = () => {
  const pathname = usePathname();
  const router = useRouter();
  const catalogId = getEmployeeCatalogPolicyIdFromPathname(pathname);
  const { getCompanyDetails, getUserDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const user = getUserDetails();
  const { cart, setCart, items, totalItems } = useCatalogPolicyCart();
  const { hasApprovedOrder, hasPendingOrder, isCheckingPendingOrder } =
    usePendingCatalogPolicyOrder(catalogId);

  const { data: dashboardRes } = useGetEmployeeDashboardQuery(
    { companyId: company?.id!, employeeId: user?.id! },
    { skip: !catalogId || !company?.id || !user?.id },
  );
  const employee = dashboardRes?.data;
  const [createOrderRequest, createOrderRequestState] =
    useCreateCatalogPolicyOrderRequestMutation();
  const departmentId =
    employee?.departments?.[0]?.id ?? employee?.department_id;
  const canPlaceOrder =
    Boolean(company?.id && catalogId && departmentId) &&
    totalItems > 0 &&
    !hasApprovedOrder &&
    !hasPendingOrder &&
    !isCheckingPendingOrder &&
    !createOrderRequestState.isLoading;

  const placeOrderRequest = async (onSuccess?: () => void) => {
    if (!company?.id || !catalogId || !departmentId) {
      displayErrorMessage(
        "Unable to place order request",
        "Missing department information.",
      );
      return;
    }

    if (totalItems === 0) {
      displayErrorMessage("Cart is empty", "Add at least one item first.");
      return;
    }

    if (isCheckingPendingOrder) {
      displayErrorMessage(
        "Checking pending order",
        "Please wait while we confirm your order status.",
      );
      return;
    }

    if (hasPendingOrder) {
      displayErrorMessage(
        "Pending order request",
        pendingCatalogPolicyOrderMessage,
      );
      return;
    }

    if (hasApprovedOrder) {
      displayErrorMessage(
        "Order request already approved",
        approvedCatalogPolicyOrderMessage,
      );
      return;
    }

    const payload = buildPolicyOrderRequestPayload({
      cart,
      departmentId,
      items,
    });

    const result = await createOrderRequest({
      companyId: company.id,
      catalogId,
      payload,
    }).unwrap();

    const record = orderRequestToRecord(
      result.data as CatalogOrderRequestApi,
      catalogId,
    );

    trackEmployeeOrderSubmitted({
      order_id: record.id ?? "",
      item_count: totalItems,
      total_value: 0,
    });

    if (record.id && record.status) {
      trackApprovalQueued({
        approval_id: record.id,
        status: record.status,
        tier: extractPrimaryApprovalTier(record.items),
      });
    }

    displaySuccessMessage("Order request placed");
    setCart({});
    onSuccess?.();
    router.push(`${pathname}?tab=${catalogPolicyDetailTabs.orderRequests}`);
  };

  return {
    canPlaceOrder,
    approvedOrderMessage: approvedCatalogPolicyOrderMessage,
    hasApprovedOrder,
    hasPendingOrder,
    isCheckingPendingOrder,
    isPlacingOrder: createOrderRequestState.isLoading,
    pendingOrderMessage: pendingCatalogPolicyOrderMessage,
    placeOrderRequest,
  };
};
