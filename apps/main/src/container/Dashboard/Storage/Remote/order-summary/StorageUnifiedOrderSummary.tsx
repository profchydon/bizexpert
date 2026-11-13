"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import PageHeader from "@/components/PageHeader";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import {
  markStorageUnifiedOrderPaid,
  useStorageUnifiedOrder,
} from "../hooks/useStorageUnifiedOrder";
import { useStorageInventory } from "../hooks/useStorageInventory";
import { useStorageServiceFees } from "../hooks/useStorageServiceFees";
import { storageAppRoutes } from "../storageAppRoutes";
import { pushStorageNotification } from "../utils/storageNotifications";
import { cartCurrency } from "../utils/storagePricing";
import { submitCheckout } from "../utils/submitCheckout";
import PaginateTab from "@/container/Dashboard/EquipEmployee/OrderSummary/PaginateTab";
import { StorageCheckoutEquipmentCard } from "./StorageCheckoutEquipmentCard";
import { Separator } from "@/components/ui/separator";
import OrderPolicy from "@/container/Dashboard/EquipEmployee/OrderSummary/OrderPolicy";
import TotalSumOrderSummary from "@/container/Dashboard/EquipEmployee/OrderSummary/TotalSumOrderSummary";
import { CheckoutItem } from "../hooks/useStorageCheckout";

export default function StorageUnifiedOrderSummary() {
  const { push, isPending } = useTransitionRouter();
  const order = useStorageUnifiedOrder();
  const { setDeviceStatus, createRequest } = useStorageInventory();
  const { lineFee, subtotal, isFeesLoading, isFeesReady } =
    useStorageServiceFees();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const groups = useMemo(() => {
    if (!order?.actionItems) return [];
    const grouped: {
      kind: "deployment" | "device_check" | "disposal";
      items: CheckoutItem[];
    }[] = [];
    const byKind: Record<string, CheckoutItem[]> = {
      deployment: [],
      device_check: [],
      disposal: [],
    };
    order.actionItems.forEach((item) => byKind[item.kind].push(item));

    if (byKind.deployment.length > 0)
      grouped.push({ kind: "deployment", items: byKind.deployment });
    if (byKind.device_check.length > 0)
      grouped.push({ kind: "device_check", items: byKind.device_check });
    if (byKind.disposal.length > 0)
      grouped.push({ kind: "disposal", items: byKind.disposal });

    return grouped;
  }, [order?.actionItems]);

  const handlePay = () => {
    if (!order?.actionItems.length || order.paid) {
      push(`${storageAppRoutes.storage}?tab=orders`);
      return;
    }
    const message = submitCheckout(order.actionItems, {
      setDeviceStatus,
      createRequest,
    });
    markStorageUnifiedOrderPaid();
    pushStorageNotification({
      title: "Requests submitted",
      description: `${message}. Track progress in Orders.`,
    });
    push(`${storageAppRoutes.storage}?tab=orders`);
  };

  if (!order?.actionItems.length) {
    return (
      <div className="py-12">
        <EmptyState size="lg" className="py-16">
          <EmptyState.Header pattern="none">
            <EmptyState.Illustration type="documents" color="gray" />
          </EmptyState.Header>
          <EmptyState.Content>
            <EmptyState.Title>Your cart is empty</EmptyState.Title>
            <EmptyState.Description>
              Queue a storage action from Inventory, then proceed to checkout.
            </EmptyState.Description>
          </EmptyState.Content>
          <EmptyState.Footer>
            <Button
              size="md"
              onClick={() => push(storageAppRoutes.storage)}
              data-testid="storageunifiedordersummary-button"
            >
              Back to storage
            </Button>
          </EmptyState.Footer>
        </EmptyState>
      </div>
    );
  }

  const total = isFeesReady ? subtotal(order.actionItems) : 0;
  const currency = cartCurrency(order.actionItems);
  const currentGroup = groups[currentPage - 1];

  return (
    <div className="pb-12 pt-6">
      <PageHeader
        pageTitle="Order summary"
        pageDescription="Review queued storage requests before submitting to Rayda Ops."
        breadCrumbs={["Storage", "Checkout"]}
      />
      <div className="mt-8 flex flex-col lg:flex-row gap-8 w-full">
        <div className="flex-1 flex flex-col gap-8">
          <PaginateTab
            previous={() => setCurrentPage((p) => Math.max(1, p - 1))}
            next={() => setCurrentPage((p) => Math.min(groups.length, p + 1))}
            currentPage={currentPage}
            totalPages={groups.length}
            label="Request"
          />

          {currentGroup && (
            <StorageCheckoutEquipmentCard
              kind={currentGroup.kind}
              items={currentGroup.items}
              getLineFee={lineFee}
              currency={currency}
            />
          )}
        </div>

        <div className="flex-1 lg:max-w-md">
          <div className="flex flex-col">
            <div className="flex flex-col gap-y-6">
              <OrderPolicy
                orderState={termsAccepted}
                setOrderState={setTermsAccepted}
                title="Terms and Conditions"
                description="I authorise Rayda Ops to carry out these actions on my stored devices, and I accept the service fees shown above. Deployments are shipped to the recipient addresses on file."
              />
              <Separator />
              <TotalSumOrderSummary
                currencySymbol={currency}
                isError={false}
                isLoading={isFeesLoading}
                totalEquipment={order.actionItems.length}
                totalFee={total}
                totalFeesArray={[
                  { key: "service_total", name: "Service total", value: total },
                ]}
              />
              <Separator />
            </div>
          </div>

          <Button
            size="xl"
            className="w-full mt-[64px]"
            isLoading={isPending || isFeesLoading}
            isDisabled={!termsAccepted || isFeesLoading}
            onClick={handlePay}
            data-testid="storageunifiedordersummary-button-2"
          >
            Submit requests
          </Button>
        </div>
      </div>
    </div>
  );
}
