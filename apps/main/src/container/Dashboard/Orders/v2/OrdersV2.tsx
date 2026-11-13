"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ExportOrder } from "@/components/Drawers/ExportOrder";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { ICompany } from "@/types/auth";
import { cn } from "@/lib/utils";
import OrdersTableV2 from "./OrdersTableV2";
import PageHeader from "@/components/PageHeader";

const CustomDeviceRequestsTable = dynamic(
  () => import("../CustomDeviceRequests"),
  { ssr: false },
);

type OrdersTab = "orders" | "custom_device_requests";

const TABS: { key: OrdersTab; label: string }[] = [
  { key: "orders", label: "Orders" },
  { key: "custom_device_requests", label: "Request for quotes" },
];

const OrdersV2 = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails() as ICompany | null;

  const getTabFromQuery = (): OrdersTab => {
    const tab = searchParams.get("tab");
    if (tab === "rfqs" || tab === "custom_device_requests") {
      return "custom_device_requests";
    }
    return "orders";
  };

  const [activeTab, setActiveTab] = useState<OrdersTab>(getTabFromQuery());

  useEffect(() => {
    setActiveTab(getTabFromQuery());
  }, [searchParams]);

  const features = useMemo(
    () => company?.subscription?.plan?.features ?? [],
    [company],
  );
  const canExportOrders = useMemo(
    () => features.some((feature) => feature?.name === "Asset Management"),
    [features],
  );

  const handleTabChange = (nextTab: OrdersTab) => {
    setActiveTab(nextTab);
    const params = new URLSearchParams(searchParams.toString());
    if (nextTab === "custom_device_requests") {
      params.set("tab", "rfqs");
    } else {
      params.set("tab", "orders");
      params.delete("rfq_id");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <section className="flex flex-col gap-6 pt-8 pb-12 sm:pt-12 sm:pb-24">
      <PageHeader
        pageTitle="Orders"
        pageDescription="View, track and manage your orders"
        breadCrumbs={["Orders"]}
      >
        {canExportOrders && activeTab === "orders" ? (
          <div className="flex gap-3">
            <ExportOrder />
          </div>
        ) : null}
      </PageHeader>

      <div className="w-full">
        <div className="mb-6">
          <div
            className="flex gap-4 border-b border-gray-200"
            role="tablist"
            aria-orientation="horizontal"
          >
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeTab === key}
                onClick={() => handleTabChange(key)}
                className={cn(
                  "relative px-1 pb-2.5 pt-0 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-none border-b-2",
                  activeTab === key
                    ? "border-primary-600 text-primary-700"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "orders" ? (
          <OrdersTableV2 />
        ) : (
          <CustomDeviceRequestsTable />
        )}
      </div>
    </section>
  );
};

export default OrdersV2;
