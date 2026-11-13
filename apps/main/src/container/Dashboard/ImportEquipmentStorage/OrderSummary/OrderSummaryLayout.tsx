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
import SignatureRequiredToggle from "@/components/Offboarding/OrderSummary/SignatureRequiredToggle";

interface Props {
  selectEmployee: IEmployees[];
  previous: () => void;
  next: () => void;
  handlepay: () => void;
  currentPage: number;
  totalPages: number;
  note: string;
  setNote: (value: string) => void;
  isSignatureRequired: boolean;
  setIsSignatureRequired: (value: boolean) => void;
}
const OrderSummaryLayout: FC<Props> = (props) => {
  const {
    selectEmployee,
    previous,
    next,
    currentPage,
    totalPages,
    handlepay,
    note,
    setNote,
    isSignatureRequired,
    setIsSignatureRequired,
  } = props;
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full mt-4">
      <div className="flex-1 flex flex-col gap-8">
        <PaginateTab
          previous={previous}
          next={next}
          currentPage={currentPage}
          totalPages={totalPages}
        />

        <DeliveryAddress data={selectEmployee?.[0]} />

        <AssociatedDeviceList
          data={selectEmployee?.[0]?.items as unknown as any}
          employee={selectEmployee?.[0]}
        />
      </div>
      <div className="flex-1">
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
            <TotalSumOrderSummary />
            <Separator />
            <OrderNote note={note} setNote={setNote} />

            <SignatureRequiredToggle
              isSignatureRequired={isSignatureRequired}
              setIsSignatureRequired={setIsSignatureRequired}
            />
          </div>
        </div>

        <Button
          className="w-full mt-[64px]"
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
