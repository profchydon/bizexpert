import React, { FC, useEffect } from "react";
import PaginateTab from "./PaginateTab";
import AssociatedDeviceList from "./AssociatedDeviceList";
import { Button } from "@/components/ui/button";
import { Offboard_asset } from "@/types/offboarding";
import AddressCard from "./AddressCard";
import { useLazyGetEmployeeEquipmentQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployeeEquipment";

import OrderNote from "./OrderNote";
import OrderPolicy from "./OrderPolicy";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TotalSumOrderSummary from "./TotalSumOrderSummary";
import dayjs from "dayjs";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import AdditionalEmailRecipients from "@/components/AdditionalEmailRecipients";
import SignatureRequiredToggle from "./SignatureRequiredToggle";

interface Props {
  selectedAsset: Offboard_asset[];
  previous: () => void;
  next: () => void;
  handlepay: () => void;
  currentPage: number;
  totalPages: number;
  companyId: string;
  setIsModifyOpen: (value: boolean) => void;
  feeData: Record<string, any>;
  allData: Offboard_asset[];
  termsAccepted: boolean;
  setTermsAccepted: (value: boolean) => void;
  transformTogetFees?: any;
  baseRoute: string;
  note: string;
  setNote: (value: string) => void;
  hideModifyBtn?: boolean;
  hideAcceptanceFinal?: boolean;
  isLoading: boolean;
  isError: boolean;
  additionalEmails: string[];
  setAdditionalEmails: (value: string[]) => void;
  isSignatureRequired: boolean;
  setIsSignatureRequired: (value: boolean) => void;
  hideSignatureToggle?: boolean;
}
const OrderSummaryLayout: FC<Props> = (props) => {
  const {
    baseRoute,
    companyId,
    selectedAsset,
    previous,
    next,
    currentPage,
    totalPages,
    handlepay,
    setIsModifyOpen,
    feeData,
    allData,
    termsAccepted,
    setTermsAccepted,
    transformTogetFees,
    note,
    setNote,
    hideModifyBtn = false,
    hideAcceptanceFinal = false,
    isError,
    isLoading,
    additionalEmails,
    setAdditionalEmails,
    isSignatureRequired,
    setIsSignatureRequired,
    hideSignatureToggle = false,
  } = props;

  const getEquipment = selectedAsset?.[0];
  const getAssignee = getEquipment?.assignee;
  const getReceiver = getEquipment?.receiver;

  const router = useRouter();
  const [getEmployeeEquipment] = useLazyGetEmployeeEquipmentQuery();

  useEffect(() => {
    if (companyId && getAssignee?.id) {
      getEmployeeEquipment({
        companyId,
        employeeId: getAssignee?.id,
      });
    }
  }, [getAssignee?.id]);

  const handleModify = ({
    actionType,
  }: {
    actionType: "Transfer" | "Store" | "Sale";
  }) => {
    switch (actionType) {
      case "Transfer":
        router.push(`${baseRoute}/order-summary?action_type=${actionType}`);
        setIsModifyOpen(true);
        break;
      case "Store":
        router.push(`${baseRoute}/order-summary?action_type=${actionType}`);
        setIsModifyOpen(true);
        break;
      case "Sale":
        router.push(`${baseRoute}/order-summary?action_type=${actionType}`);
        setIsModifyOpen(true);
        break;
      default:
        console.warn(`Unhandled action type: ${actionType}`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full mt-[40px]">
      <div className="flex-1 flex flex-col gap-8">
        <PaginateTab
          previous={previous}
          next={next}
          currentPage={currentPage}
          totalPages={totalPages}
        />

        <DropdownMenu>
          {!hideModifyBtn && (
            <DropdownMenuTrigger asChild>
              <Button variant="outline" data-testid="ordersummarylayout-button">
                Modify order
              </Button>
            </DropdownMenuTrigger>
          )}

          <DropdownMenuContent className="min-w-[300px] max-w-full">
            {Array.from(
              new Set(
                selectedAsset?.[0]?.assets
                  ?.map((action) => action?.actionType)
                  .filter(Boolean)
                  .filter((item) => item !== "Archive"), // Remove undefined values
              ),
            ).map((item) => (
              <DropdownMenuItem
                key={item}
                className="w-full max-w-full"
                onClick={() =>
                  handleModify({
                    actionType: item as "Transfer" | "Store" | "Sale",
                  })
                }
              >
                {`${item} order(s)`}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedAsset?.[0]?.assignee &&
          (selectedAsset?.[0]?.assignee as unknown as string) !==
            UNASSIGNED_ORDER_SUMMARY_KEY && (
            <AddressCard
              title="Pick up address"
              description="Shared with our logistics partners."
              country={getAssignee?.country as string}
              country_code={getAssignee?.country_code as string}
              address={getAssignee?.address as string}
              employment_type={getAssignee?.employment_type as string}
              name={getAssignee?.name as string}
              email={getAssignee?.email as string}
              phone={getAssignee?.phone as string}
              collectionDate={
                getEquipment?.collectionDate &&
                dayjs(getEquipment?.collectionDate).format("MMM DD, YYYY")
              }
            />
          )}
        {selectedAsset?.[0]?.receiver && (
          <AddressCard
            title="Delivery address"
            description="Shared with our logistics partners."
            country={getReceiver?.country as string}
            country_code={getReceiver?.country_code as string}
            address={getReceiver?.address as string}
            employment_type={getReceiver?.employment_type as string}
            name={getReceiver?.first_name as string}
            email={getReceiver?.email as string}
            phone={getReceiver?.phone as string}
          />
        )}
        <AssociatedDeviceList
          data={selectedAsset?.[0]?.assets as any[]}
          feeData={feeData}
        />
      </div>
      <div className="flex-1">
        <div className=" flex flex-col">
          <div className="flex flex-col gap-y-6">
            <OrderPolicy
              orderState={termsAccepted}
              setOrderState={setTermsAccepted}
              title="Terms and Conditions"
              description={`I acknowledge my responsibility for providing the employee's
              correct address. I also understand that incorrect information can
              impact the recovery process, and I will be charged an Offboarding
              fee for every failed recovery attempt for each workstation.`}
            />
            <Separator />
            <TotalSumOrderSummary
              isError={isError}
              isLoading={isLoading}
              feeData={feeData}
              allData={allData}
            />
            <Separator />
            <AdditionalEmailRecipients
              emails={additionalEmails}
              onChange={setAdditionalEmails}
            />
            <Separator />
            <OrderNote note={note} setNote={setNote} />

            {!hideSignatureToggle && (
              <SignatureRequiredToggle
                isSignatureRequired={isSignatureRequired}
                setIsSignatureRequired={setIsSignatureRequired}
              />
            )}
          </div>
        </div>

        <Button
          className="w-full mt-[64px]"
          disabled={
            !termsAccepted || Object.keys(transformTogetFees).length < 1
          }
          onClick={handlepay}
          data-testid="ordersummarylayout-button-2"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
};

export default OrderSummaryLayout;
