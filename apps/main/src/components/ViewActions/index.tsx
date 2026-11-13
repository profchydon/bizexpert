"use client";

import React, { useEffect, useState } from "react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { ArrowLeft } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabActionType<T> = {
  label: string;
  value: string;
  component: React.FC<{ data: T[]; baseRoute: string; currentTab: string }>;
};

type ViewActionsProps<T extends { actionType?: string }> = {
  baseRoute: string;
  previousRoute?: string;
  breadCrumbs: any[];
  secondaryButtonText: string;
  tabs: TabActionType<T>[];
  data: T | T[] | null | undefined;
  handleSecondaryButton?: () => void;
  handleCheckout?: () => void;
  checkoutRoute?: string;
  isCheckOutDisabled?: boolean;
};

const ViewActions = <T extends { actionType?: string }>({
  baseRoute,
  breadCrumbs,
  secondaryButtonText,
  tabs,
  data,
  handleSecondaryButton,
  handleCheckout,
  checkoutRoute,
  isCheckOutDisabled,
  previousRoute,
}: ViewActionsProps<T>) => {
  const { push, back, isPending } = useTransitionRouter();
  const [tab, setTab] = useState(tabs[0]?.value || "");
  const [activeNav, setActiveNav] = useState<"back" | "checkout" | null>(null);

  const normalizeData = (): T[] => {
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  };

  const getActionsByType = (type: string): T[] => {
    return normalizeData().filter((item) => item.actionType === type);
  };

  useEffect(() => {
    const hasNoValidTabs = tabs.every(
      (t) => getActionsByType(t.value).length === 0,
    );
    if (!data || hasNoValidTabs) {
      push(baseRoute);
      return;
    }

    if (!Array.isArray(data)) {
      setTab(data?.actionType || tabs[0]?.value);
    } else {
      const firstTabWithData = tabs.find(
        (t) => getActionsByType(t.value).length > 0,
      );
      if (firstTabWithData) setTab(firstTabWithData.value);
    }
  }, [data]);

  useEffect(() => {
    if (!isPending) {
      setActiveNav(null);
    }
  }, [isPending]);

  const handleBackClick = () => {
    setActiveNav("back");
    if (handleSecondaryButton) {
      handleSecondaryButton();
      return;
    }
    push(previousRoute || baseRoute);
  };

  const handleCheckoutClick = () => {
    setActiveNav("checkout");
    if (checkoutRoute) {
      push(checkoutRoute);
      return;
    }
    if (handleCheckout) {
      handleCheckout();
      return;
    }
    push(`${baseRoute}/order-summary`);
  };

  return (
    <div className="flex flex-col py-8">
      <PageHeader
        breadCrumbs={breadCrumbs}
        pageTitle="See actions"
        pageDescription="View all the actions you want to take"
        onBack={() => back()}
      >
        <div className="md:self-end flex gap-3 pb-5">
          <Button
            variant="outline"
            isLoading={isPending && activeNav === "back"}
            disabled={isPending && activeNav === "checkout"}
            data-testid="viewactions-button"
            onClick={handleBackClick}
          >
            <span className="text-sm font-semibold flex items-center gap-2">
              <ArrowLeft size={18} />
              <p>{secondaryButtonText}</p>
            </span>
          </Button>
          <Button
            variant="primary"
            isLoading={isPending && activeNav === "checkout"}
            disabled={isCheckOutDisabled || (isPending && activeNav === "back")}
            data-testid="viewactions-button-2"
            onClick={handleCheckoutClick}
          >
            <span className="text-sm font-semibold">Checkout</span>
          </Button>
        </div>
      </PageHeader>

      <div className="mt-8">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="flex flex-col items-start mb-4">
            <div className="flex flex-row gap-3">
              {tabs.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="px-0">
                  {t.label} ({getActionsByType(t.value).length})
                </TabsTrigger>
              ))}
            </div>
            <Separator />
          </TabsList>

          {tabs.map((t) => (
            <TabsContent
              key={t.value}
              value={t.value}
              className="flex flex-col gap-8"
            >
              <t.component
                data={getActionsByType(t.value)}
                baseRoute={baseRoute}
                currentTab={tab}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ViewActions;
