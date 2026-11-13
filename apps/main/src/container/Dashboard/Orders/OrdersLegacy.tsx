"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { ICompany } from "@/types/auth";
import { ExportOrder } from "@/components/Drawers/ExportOrder";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OrdersTable = dynamic(() => import("./OrdersTable"), {
  ssr: false,
});

const CustomDeviceRequestsTable = dynamic(
  () => import("./CustomDeviceRequests"),
  {
    ssr: false,
  },
);

const OrdersLegacy = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails() as ICompany | null;

  const getTabFromQuery = () => {
    const tab = searchParams.get("tab");

    if (tab === "rfqs" || tab === "custom_device_requests") {
      return "custom_device_requests" as const;
    }

    return "orders" as const;
  };

  const [activeTab, setActiveTab] = useState<
    "orders" | "custom_device_requests"
  >(getTabFromQuery());

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
  const breadcrumbs = useMemo(() => ["Orders"], []);

  return (
    <section className="flex flex-col gap-8 py-8">
      <PageHeader
        breadCrumbs={breadcrumbs}
        pageTitle="Orders"
        pageDescription="View, track and manage your orders"
        onBack={() => router.back()}
      >
        <div className="md:self-end flex gap-3 pb-5">
          {canExportOrders && activeTab === "orders" && <ExportOrder />}
        </div>
      </PageHeader>

      <div className="w-full">
        <div className="mb-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              const nextTab = value as "orders" | "custom_device_requests";
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
            }}
          >
            <TabsList className="h-auto justify-start rounded-none bg-transparent p-0">
              <TabsTrigger
                value="orders"
                className="rounded-none px-4 py-2 text-sm"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="custom_device_requests"
                className="rounded-none px-4 py-2 text-sm"
              >
                Request for quotes
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === "orders" ? (
          <OrdersTable />
        ) : (
          <CustomDeviceRequestsTable />
        )}
      </div>
    </section>
  );
};

export default OrdersLegacy;
