import type { FeeRow, FeeSummaryLike } from "@/lib/tax/feeSummary";
import { IEmployees } from "@/types/employees";
import React, { FC, useState } from "react";
import PaginateTab from "./PaginateTab";
import DeliveryAddress from "./DeliveryAddress";
import AssociatedDeviceList from "./AssociatedDeviceList";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TotalSumOrderSummary from "./TotalSumOrderSummary";
import OrderPolicy from "./OrderPolicy";
import OrderNote from "@/components/Offboarding/OrderSummary/OrderNote";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import AdditionalEmailRecipients from "@/components/AdditionalEmailRecipients";
import SignatureRequiredToggle from "@/components/Offboarding/OrderSummary/SignatureRequiredToggle";
import { PlanSavingsCallout } from "@/components/checkout/PlanSavingsCallout";
import { readSubscriberSaving } from "@/lib/pricing/subscriberSaving";

interface Props {
  selectEmployee: IEmployees[];
  previous: () => void;
  next: () => void;
  handlepay: () => void;
  currentPage: number;
  totalPages: number;
  isStorageOnlyFlow?: boolean;
  itemFeeSummary?: Record<string, any>;
  itemFeeTotal?: number;
  skipItemFeeQuery?: boolean;

  isLoading: boolean;
  isError: boolean;
  currencySymbol: string;
  totalFeesArray: FeeRow[];
  totalFeesSummary?: FeeSummaryLike;
  totalEquipment: number;
  totalFee: number;
  note: string;
  setNote: (value: string) => void;
  additionalEmails: string[];
  setAdditionalEmails: (value: string[]) => void;
  isSignatureRequired: boolean;
  setIsSignatureRequired: (value: boolean) => void;
  isAutoEnabled?: boolean;
  orderTotal?: number;
}
const OrderSummaryLayout: FC<Props> = (props) => {
  const {
    selectEmployee,
    previous,
    next,
    currentPage,
    totalPages,
    isStorageOnlyFlow = false,
    itemFeeSummary,
    itemFeeTotal,
    skipItemFeeQuery,
    handlepay,
    currencySymbol,
    isError,
    isLoading,
    totalEquipment,
    totalFeesArray,
    totalFeesSummary,
    totalFee,
    note,
    setNote,
    additionalEmails,
    setAdditionalEmails,
    isSignatureRequired,
    setIsSignatureRequired,
    isAutoEnabled,
    orderTotal,
  } = props;
  const [termsAccepted, setTermsAccepted] = useState(false);
  const saving = readSubscriberSaving(totalFeesSummary);
  return (
    <div className="mt-4 flex w-full min-w-0 flex-col gap-8 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <PaginateTab
          previous={previous}
          next={next}
          currentPage={currentPage}
          totalPages={totalPages}
          label={
            selectEmployee?.[0]?.destination_type === "office" ||
            String(selectEmployee?.[0]?.id || "").startsWith("office:")
              ? "Request"
              : "Page"
          }
        />

        {selectEmployee?.[0]?.id !== UNASSIGNED_ORDER_SUMMARY_KEY && (
          <DeliveryAddress data={selectEmployee?.[0]} />
        )}

        <AssociatedDeviceList
          data={selectEmployee?.[0]?.items}
          employee={selectEmployee?.[0]}
          itemFeeSummary={itemFeeSummary}
          itemFeeTotal={itemFeeTotal}
          isStorageOnlyFlow={isStorageOnlyFlow}
          skipFeeQuery={skipItemFeeQuery}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className=" flex flex-col">
          <div className="flex flex-col gap-y-6">
            <OrderPolicy
              orderState={termsAccepted}
              setOrderState={setTermsAccepted}
              title="Terms and Conditions"
              description={`I acknowledge my responsibility for providing the employee's correct address. I also understand that incorrect information can impact the delivery process, and I will be charged an 
                onboarding fee for every failed delivery attempt for each employee.`}
            />
            <Separator />
            <TotalSumOrderSummary
              currencySymbol={currencySymbol}
              isError={isError}
              isLoading={isLoading}
              totalEquipment={totalEquipment}
              totalFee={totalFee}
              totalFeesArray={totalFeesArray}
              totalFeesSummary={totalFeesSummary}
            />
            <Separator />
            <AdditionalEmailRecipients
              emails={additionalEmails}
              onChange={setAdditionalEmails}
            />
            <Separator />

            <OrderNote note={note} setNote={setNote} />

            {selectEmployee?.[0]?.id !== UNASSIGNED_ORDER_SUMMARY_KEY && (
              <SignatureRequiredToggle
                isSignatureRequired={isSignatureRequired}
                setIsSignatureRequired={setIsSignatureRequired}
                isAutoEnabled={isAutoEnabled}
                orderTotal={orderTotal}
              />
            )}
          </div>
        </div>

        {saving ? (
          <PlanSavingsCallout
            variant="card"
            amount={saving.amount}
            currencySymbol={currencySymbol}
            isSubscribed={Boolean(saving.is_subscribed)}
            className="mt-[64px]"
          />
        ) : null}
        <Button
          className={`w-full ${saving ? "mt-3" : "mt-[64px]"}`}
          onClick={handlepay}
          disabled={!termsAccepted}
          data-testid="ordersummarylayout-button"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
};

export default OrderSummaryLayout;
