"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { annualData } from "./mockData";
import SPFeatureCard from "./SPFeatureCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePlansQuery } from "@/api/baseQueries/plansApi/plans";
import PageState from "@/components/PageState";
import formatAmount from "@/utils/formatAmount";
import { companyBillingCurrencySymbol } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { IPlan } from "@/types/plans";
import { ISubscription } from "@/types/subscriptions";
import DrawerRight from "@/components/DrawerRight";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPayment: () => void;
  isLoading: boolean;
  selectedCardValue: string;
  handleCardSelection: (value: string) => void;
  setSelectedPlan: (value: IPlan) => void;
  selectedPlan?: IPlan;
  subscription: ISubscription;
}

const SubscriptionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onPayment,
  isLoading,
  selectedCardValue,
  handleCardSelection,
  setSelectedPlan,
  selectedPlan,
  subscription,
}) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const {
    data: plansRes,
    isLoading: isPlansLoading,
    isError,
  } = usePlansQuery();
  const plans = plansRes?.data.data ?? [];

  return (
    <div>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={onClose}
        width={"1359"}
        drawerTitle=""
        drawerDescription=""
        hideDefaultFooterBtn
        enableOverlay={true}
        className="xl:min-w-[1200px] lg:min-w-[700px] md:min-w-[500px] h-[calc(100%-30px)]"
        data-testid="subscriptionmodal-drawerright"
      >
        <div className="flex flex-row absolute bg-white w-full top-3 items-center py-2 z-50">
          <div className="flex flex-col gap-y-1">
            <h3 className="text-3xl text-gray-900 font-semibold">
              Plans that fit your scale
            </h3>
            <p className="text-base text-gray-600">
              Simple, transparent pricing that grows with you.
            </p>
          </div>
          <div className="flex flex-row items-center gap-3 absolute right-14">
            <Select data-testid="subscriptionmodal-select">
              <SelectTrigger>
                <SelectValue placeholder="Annually" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Annually">Annually</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              className="w-full"
              onClick={() => {
                if (selectedPlan?.slug !== "procure") {
                  onPayment();
                } else {
                  onClose();
                }
              }}
              disabled={
                isLoading ||
                !selectedCardValue ||
                selectedPlan?.id === subscription.plan.id
              }
              data-testid="subscriptionmodal-button"
            >
              Make payment
            </Button>
          </div>
        </div>

        {/* <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="lg:min-w-[1200px] md:min-w-[704px] w-[calc(100%-30px)] h-[calc(100%-30px)] overflow-y-auto"
          showCloseButton={false}
        >
          <DialogHeader className="flex flex-row items-end justify-between">
            <div className="flex flex-col">
              <h3 className="text-3xl text-gray-900 font-semibold">
                Plans that fit your scale
              </h3>
              <p className="text-base text-gray-600">
                Simple, transparent pricing that grows with you.
              </p>
            </div>
            {selectedPlan?.name.toLowerCase() !== "enterprise" && (
              <div className="flex flex-row items-center gap-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Annually"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Annually">Annually</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button
                  className="w-full"
                  onClick={() => {
                    if (selectedPlan?.slug !== "lite") {
                      onPayment();
                    } else {
                      onClose();
                    }
                  }}
                  disabled={
                    isLoading ||
                    !selectedCardValue ||
                    selectedPlan?.id === subscription.plan.id
                  }
                >
                  Make payment
                </Button>
              </div>
            )}
          </DialogHeader> */}

        <PageState isLoading={isPlansLoading} isError={isError}>
          <ToggleGroup
            type="single"
            defaultValue={selectedCardValue}
            value={selectedCardValue}
            className="w-full grid grid-cols-2 gap-6 mt-12 pl-px"
            onValueChange={(value: string) => handleCardSelection?.(value)}
          >
            {plans.map((plan) => (
              <ToggleGroupItem
                key={plan.id}
                variant="outline"
                value={plan.id}
                className="h-full grid grid-cols-1 px-0 py-0 border-0 items-start"
                onClick={() => setSelectedPlan(plan)}
              >
                <SPFeatureCard
                  id={plan.id}
                  plan={plan.name}
                  description={plan.description}
                  key={plan.id}
                  data={plan.features}
                  price={formatAmount(plan.price.amount)}
                  currency={companyBillingCurrencySymbol(company)}
                  selectedCardValue={selectedCardValue}
                  feature_description={plan.description}
                />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </PageState>
      </DrawerRight>
    </div>
  );
};

export default SubscriptionModal;
