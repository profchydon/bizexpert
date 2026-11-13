"use client";

import EmptyTableInstance from "@/components/EmptyTableInstance";
import PageHeader from "@/components/PageHeader";
import PageState from "@/components/PageState";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGetEmployeeDashboardQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployeeDashboard";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { cn } from "@/lib/utils";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useMemo } from "react";
import CatalogPolicyOrders from "../../OverView/CatalogPolicyOrders";
import {
  catalogPolicyDetailTabFromParam,
  catalogPolicyDetailTabs,
  type CatalogPolicyDetailTab,
} from "../catalogPolicyTabs";
import { useCatalogPolicyCart } from "../CatalogPolicyCartContext";
import { usePendingCatalogPolicyOrder } from "../usePendingCatalogPolicyOrder";
import PolicyItemList from "./PolicyItemList";
import { getPolicyItems, syncRequiredPolicyCart, titleCase } from "./utils";
import {
  getOpenSelectionGroups,
  getOpenSelectionItems,
  isOpenSelectionPolicy,
  pruneOpenSelectionCart,
} from "./selectionConfigGroups";
import { trackEmployeeCatalogViewed } from "@/lib/employeePortalAnalytics";

const CatalogPolicyDetail = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const catalogId = id as string;
  const { getCompanyDetails, getUserDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const user = getUserDetails();
  const { cart, setCart, setCartDisabled, setCartOpen, setItems, totalItems } =
    useCatalogPolicyCart();
  const {
    approvedOrderMessage,
    hasApprovedOrder,
    hasPendingOrder,
    isCheckingPendingOrder,
    pendingOrderMessage,
  } = usePendingCatalogPolicyOrder(catalogId);

  const {
    data: dashboardRes,
    isError,
    isLoading,
  } = useGetEmployeeDashboardQuery(
    { companyId: company?.id!, employeeId: user?.id! },
    { skip: !company?.id || !user?.id },
  );

  const policy = dashboardRes?.data.catalog_policies?.find(
    (catalogPolicy) => catalogPolicy.id === catalogId,
  );
  const kits = useMemo(() => policy?.kits?.data ?? [], [policy?.kits?.data]);
  const isOpenPolicy = isOpenSelectionPolicy(policy?.selection_mode);
  const kitItems = useMemo(() => getPolicyItems(kits), [kits]);
  const openGroups = useMemo(
    () => getOpenSelectionGroups(kitItems, policy?.selection_config),
    [kitItems, policy?.selection_config],
  );
  const items = useMemo(
    () => (isOpenPolicy ? getOpenSelectionItems(openGroups) : kitItems),
    [isOpenPolicy, kitItems, openGroups],
  );
  const activeTab = catalogPolicyDetailTabFromParam(searchParams.get("tab"));

  const setActiveTab = (tab: CatalogPolicyDetailTab) => {
    router.replace(
      tab === catalogPolicyDetailTabs.catalog
        ? pathname
        : `${pathname}?tab=${tab}`,
      { scroll: false },
    );
  };

  useEffect(() => {
    setItems(items);
    setCart((currentCart) =>
      hasApprovedOrder
        ? {}
        : isOpenPolicy
          ? pruneOpenSelectionCart(currentCart, openGroups)
          : syncRequiredPolicyCart(currentCart, items),
    );
  }, [hasApprovedOrder, isOpenPolicy, items, openGroups, setCart, setItems]);

  useEffect(() => {
    setCartDisabled(hasApprovedOrder);
    if (hasApprovedOrder) setCartOpen(false);
    return () => setCartDisabled(false);
  }, [hasApprovedOrder, setCartDisabled, setCartOpen]);

  useEffect(() => {
    if (catalogId && policy) {
      trackEmployeeCatalogViewed();
    }
  }, [catalogId, policy]);

  return (
    <PageState isError={isError} isLoading={isLoading}>
      {policy ? (
        <div className="flex flex-col gap-y-6">
          <PageHeader
            pageTitle={policy.name}
            pageDescription={policy.description ?? "Catalog policy details"}
            extraDescription={
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="blue">{titleCase(policy.selection_mode)}</Badge>
                <Badge variant="blue">{titleCase(policy.approval_type)}</Badge>
                <Badge variant="blue">{titleCase(policy.status)}</Badge>
              </div>
            }
            onBack={() => router.back()}
          />

          <div className="flex gap-2 border-b">
            <DetailTab
              active={activeTab === "catalog"}
              label="Catalog"
              onClick={() => setActiveTab(catalogPolicyDetailTabs.catalog)}
            />
            <DetailTab
              active={activeTab === catalogPolicyDetailTabs.orderRequests}
              label="Order Request"
              onClick={() =>
                setActiveTab(catalogPolicyDetailTabs.orderRequests)
              }
            />
          </div>

          {activeTab === catalogPolicyDetailTabs.catalog ? (
            <div className="space-y-6 border-l p-6 pt-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Policy items
                </h2>
                <p className="text-sm text-gray-500">
                  Items available from the matched catalog policy kits.
                </p>
              </div>

              <Separator />

              <PolicyItemList
                cart={cart}
                approvedOrderMessage={approvedOrderMessage}
                hasApprovedOrder={hasApprovedOrder}
                hasPendingOrder={hasPendingOrder}
                isOpenPolicy={isOpenPolicy}
                isCheckingPendingOrder={isCheckingPendingOrder}
                items={items}
                openGroups={openGroups}
                pendingOrderMessage={pendingOrderMessage}
                setCart={setCart}
                setCartOpen={setCartOpen}
                totalItems={totalItems}
              />
            </div>
          ) : (
            <div className="border-l p-6 pt-0">
              <CatalogPolicyOrders
                catalogPolicies={[policy]}
                title="Order Requests"
                description="View order requests for this catalog policy."
              />
            </div>
          )}
        </div>
      ) : (
        <EmptyTableInstance
          description="This catalog policy was not found in your dashboard."
          title="Catalog policy not found"
        />
      )}
    </PageState>
  );
};

export default CatalogPolicyDetail;

function DetailTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-gray-500",
        active && "border-primary-700 text-primary-700",
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
