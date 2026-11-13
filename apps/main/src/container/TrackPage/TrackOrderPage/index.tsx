"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { OrderSearchBar } from "../OrderSearchBar";
import {
  OrderTrackingData,
  useGetOrderTrackingMutation,
} from "@/api/baseQueries/orderTrackingApi/orderTracking";
import { TrackOrderFormValues, trackOrderSchema } from "../validation";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { useParams, useRouter } from "next/navigation";
import { OrderHeader } from "../OrderHeader";
import { OrderProgressTimeline } from "../OrderProgressTimeline";
import { DeliverySummaryCard } from "../DeliverySummaryCard";
import { OrderItemsList } from "../OrderItemsList";
import { TrackingEventsTimeline } from "../TrackingEventsTimeline";
import PageState from "@/components/PageState";
import { Separator } from "@/components/ui/separator";
import { TrackOrderBreadcrumb } from "../TrackOrderBreadcrumb";
import { trackTrackPageViewed } from "@/lib/employeePortalAnalytics";

const TrackedOrderPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const hasOrderId = Boolean(orderId);
  const [trackingData, setTrackingData] = useState<OrderTrackingData | null>(
    null,
  );
  const [lastSearchedId, setLastSearchedId] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [getOrderTracking, getOrderTrackingProps] =
    useGetOrderTrackingMutation();

  const form = useForm<TrackOrderFormValues>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: {
      orderId: orderId || "",
    },
  });

  useEffect(() => {
    if (!orderId) return;
    trackTrackPageViewed({ order_id: orderId });
    trackOrder(orderId);
  }, [orderId]);

  const trackOrder = async (orderNumber: string) => {
    setHasSearched(true);
    setLastSearchedId(orderNumber);

    try {
      const res = await getOrderTracking({
        order_number: orderNumber.trim().toUpperCase(),
      }).unwrap();

      if (res.success && res.data) {
        setTrackingData(res.data);
      } else {
        setTrackingData(null);
      }
    } catch {
      setTrackingData(null);
      setNotFound(false);
      displayErrorMessage("Unable to refresh tracking details");
    }
  };

  const onSubmit = async (values: TrackOrderFormValues) => {
    const id = values.orderId.trim().toUpperCase();
    router.push(`/track/${id}`);
  };

  const pageHeading = useMemo(
    () => (
      <div className="space-y-2">
        <h1 className="text-[34px] leading-[42px] font-semibold text-gray-900">
          Order tracking
        </h1>
        <p className="text-base text-gray-600">
          Track your order status and view delivery details in real-time
        </p>
      </div>
    ),
    [],
  );

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 py-6 sm:px-6 sm:py-8 xl:px-8 space-y-6">
      {pageHeading}
      <Separator />
      {hasOrderId && (
        <TrackOrderBreadcrumb
          orderType={trackingData?.order_type}
          orderTypeDisplay={trackingData?.order_type_display}
        />
      )}

      {!hasOrderId && (
        <OrderSearchBar
          form={form}
          onSubmit={onSubmit}
          isLoading={getOrderTrackingProps.isLoading}
        />
      )}

      <div>
        <Card className="p-2 sm:p-6">
          <PageState
            isError={getOrderTrackingProps.isError && !notFound}
            isLoading={getOrderTrackingProps.isLoading}
          >
            <CardContent className="p-2 sm:p-4">
              {!hasSearched && !trackingData && (
                <EmptyTableInstance
                  title="Track Your Order"
                  description="Enter your order number above to see real time updates on your delivery"
                />
              )}
              {trackingData && (
                <div className="space-y-4 sm:space-y-6">
                  <Card className="p-2 sm:p-4 shadow-none">
                    <OrderHeader
                      orderId={trackingData.order_id}
                      trackingLink={trackingData.tracking_link}
                      onRefresh={() => trackOrder(lastSearchedId)}
                    />

                    <OrderProgressTimeline
                      allStatuses={trackingData.all_statuses}
                      currentStatus={trackingData.status}
                      estimatedDelivery={trackingData.estimated_delivery}
                      lastUpdated={trackingData.last_updated}
                    />
                  </Card>

                  <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,1fr)] gap-4 sm:gap-6">
                    <Card className="p-2 sm:p-4 space-y-4 sm:space-y-6 shadow-none">
                      <DeliverySummaryCard
                        statusDisplay={trackingData.status_display}
                        estimatedDelivery={trackingData.estimated_delivery}
                        destination={trackingData.destination}
                        currentLocation={trackingData.current_location}
                      />

                      <TrackingEventsTimeline
                        events={trackingData.tracking_events}
                      />
                    </Card>

                    <OrderItemsList
                      items={trackingData.items}
                      status={trackingData.status}
                      orderDate={trackingData.order_date}
                      trackingLink={trackingData.external_tracking_link || ""}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </PageState>
          {hasSearched && !trackingData && !getOrderTrackingProps.isLoading && (
            <EmptyTableInstance
              title="No order found"
              description={`We couldn't find an order matching ${lastSearchedId}.`}
            />
          )}
        </Card>
      </div>
    </div>
  );
};
export default TrackedOrderPage;
