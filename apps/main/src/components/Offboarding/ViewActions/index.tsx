"use client";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import React, { useEffect, useMemo, useState } from "react";
import ViewStorageActionTable from "./ViewStorageActionTable";
import ViewSalesActionTable from "./ViewSalesActionTable";
import { useAppSelector } from "@/store";
import { Offboard_asset } from "@/types/offboarding";
import ViewTransferActionsTable from "./ViewTransferActionsTable";

const ViewActions: React.FC<{
  baseRoute: string;
  breadCrumbs: any[];
  secondaryButtonText: string;
  handleSecondaryButton?: () => void;
  handleCheckout?: () => void;
}> = ({
  baseRoute,
  breadCrumbs,
  secondaryButtonText,
  handleSecondaryButton,
  handleCheckout,
}) => {
  const { push, back, isPending } = useTransitionRouter();
  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset;

  const [tab, setTab] = useState("Transfer");

  const getActonsDB = (tab: string) => {
    if (Array.isArray(offboardingData)) {
      return offboardingData?.filter((item) => item?.actionType === tab);
    }
    return [offboardingData]?.filter((item) => item?.actionType === tab);
  };

  useEffect(() => {
    if (
      !offboardingData ||
      Object.keys(offboardingData)?.length < 1 ||
      ((getActonsDB("Transfer")?.length || 0) === 0 &&
        (getActonsDB("Store")?.length || 0) === 0)
    ) {
      return push(baseRoute);
    }

    if (!offboardingData || Object.keys(offboardingData)?.length > 1) return;

    let activeTab = "";

    if (Array.isArray(offboardingData)) {
      activeTab =
        [...offboardingData]
          ?.map((item) => item?.actionType)
          ?.filter(Boolean)
          ?.sort()[0] || "";
    } else {
      activeTab = offboardingData?.actionType || "";
    }

    setTab(activeTab);
  }, [offboardingData]);

  const actionsDB = useMemo(() => {
    return getActonsDB(tab);
  }, [tab, offboardingData]) as Offboard_asset[];

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
            isLoading={isPending}
            data-testid="viewactions-button"
            onClick={() => {
              if (!handleSecondaryButton) {
                push(baseRoute);
              } else {
                handleSecondaryButton();
              }
            }}
          >
            <span className="text-sm font-semibold flex flex-row items-center gap-2">
              <ArrowLeft size={18} />
              <p className="font-semibold">{secondaryButtonText}</p>
            </span>
          </Button>
          <Button
            variant="primary"
            isLoading={isPending}
            data-testid="viewactions-button-2"
            disabled={
              (getActonsDB("Transfer")?.length || 0) === 0 &&
              (getActonsDB("Store")?.length || 0) === 0
            }
            onClick={() => {
              if (!handleCheckout) {
                push(`${baseRoute}/order-summary`);
              } else {
                handleCheckout();
              }
            }}
          >
            <span className="text-sm font-semibold">Checkout</span>
          </Button>
        </div>
      </PageHeader>

      <div className="mt-8">
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value)}
          className="w-full"
        >
          <TabsList className="flex flex-col items-start mb-4">
            <div className="flex flex-row gap-3">
              <TabsTrigger value={"Transfer"} className="px-0">
                Reassign ({getActonsDB("Transfer")?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="Store" className="px-0">
                Storage ({getActonsDB("Store")?.length || 0})
              </TabsTrigger>
              {/* <TabsTrigger value="Sale" className="px-0">
                Sale ({getActonsDB("Sale")?.length || 0})
              </TabsTrigger> */}
            </div>
            <Separator />
          </TabsList>

          <TabsContent value="Transfer" className="flex flex-col gap-8">
            <ViewTransferActionsTable baseRoute={baseRoute} data={actionsDB} />
          </TabsContent>
          <TabsContent value="Store" className="flex flex-col gap-8">
            <ViewStorageActionTable baseRoute={baseRoute} data={actionsDB} />
          </TabsContent>
          {/* <TabsContent value="Sale" className="flex flex-col gap-8">
            <ViewSalesActionTable data={actionsDB} />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
};

export default ViewActions;
