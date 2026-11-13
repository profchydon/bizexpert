import type { ReactNode } from "react";
import type { FeeSummaryLike } from "@/lib/tax/feeSummary";
import type { IEmployees } from "@/types/employees";
import OrderSummaryHeader from "./OrderSummaryHeader";
import OrderSummaryLayout from "./OrderSummaryLayout";
import PaymentMethods from "@/components/Drawers/PaymentMethods";
import type { OrderSummaryFeeDisplay } from "./pickOrderSummaryFeeDisplay";

type Props = {
  additionalEmails: string[];
  breadCrumbs: ReactNode[];
  closePaymentmethod: () => void;
  currentItems: IEmployees[];
  currentPage: number;
  display: OrderSummaryFeeDisplay;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  handleCardSelection: (value: string) => void;
  handleConfirm: () => void;
  isApprovalOrderSummaryFlow: boolean;
  isPaymentLoading: boolean;
  isPaymentmethodOpen: boolean;
  onBack?: () => void;
  isSignatureRequired: boolean;
  isStorageOnlyFlow: boolean;
  itemFeeSummary?: Record<string, unknown>;
  itemFeeTotal?: number;
  note: string;
  orderOfficeIds: string[];
  selectedCardValue?: string;
  setAdditionalEmails: (value: string[]) => void;
  setIsSignatureRequired: (value: boolean) => void;
  setNote: (value: string) => void;
  setTabState: (value: "Card" | "Credit") => void;
  skipItemFeeQuery: boolean;
  tabState: "Card" | "Credit";
  togglePaymentmethod: () => void;
  totalPages: number;
};

export function OrderSummaryUpdatedView({
  additionalEmails,
  breadCrumbs,
  closePaymentmethod,
  currentItems,
  currentPage,
  display,
  goToNextPage,
  goToPreviousPage,
  handleCardSelection,
  handleConfirm,
  isApprovalOrderSummaryFlow,
  isPaymentLoading,
  isPaymentmethodOpen,
  onBack,
  isSignatureRequired,
  isStorageOnlyFlow,
  itemFeeSummary,
  itemFeeTotal,
  note,
  orderOfficeIds,
  selectedCardValue,
  setAdditionalEmails,
  setIsSignatureRequired,
  setNote,
  setTabState,
  skipItemFeeQuery,
  tabState,
  togglePaymentmethod,
  totalPages,
}: Props) {
  const summary = display.summary as FeeSummaryLike | undefined;

  return (
    <div className="flex flex-col py-8">
      <OrderSummaryHeader breadCrumbs={breadCrumbs} onBack={onBack} />
      <OrderSummaryLayout
        selectEmployee={currentItems}
        previous={goToPreviousPage}
        next={goToNextPage}
        currentPage={currentPage}
        totalPages={totalPages}
        isStorageOnlyFlow={isStorageOnlyFlow}
        itemFeeSummary={itemFeeSummary}
        itemFeeTotal={
          isApprovalOrderSummaryFlow ? display.totalEquipment : itemFeeTotal
        }
        skipItemFeeQuery={skipItemFeeQuery}
        handlepay={togglePaymentmethod}
        currencySymbol={summary?.currency?.symbol!}
        totalFee={summary?.total_fee!}
        totalEquipment={display.totalEquipment}
        totalFeesArray={display.rows}
        totalFeesSummary={summary}
        isError={display.isError}
        isLoading={display.isLoading}
        note={note}
        setNote={setNote}
        additionalEmails={additionalEmails}
        setAdditionalEmails={setAdditionalEmails}
        isSignatureRequired={isSignatureRequired}
        setIsSignatureRequired={setIsSignatureRequired}
        isAutoEnabled={!!summary?.total_fee && summary.total_fee >= 2500}
        orderTotal={summary?.total_fee}
      />
      <PaymentMethods
        isOpen={isPaymentmethodOpen}
        onClose={closePaymentmethod}
        onSave={handleConfirm}
        selectedCardValue={selectedCardValue}
        handleCardSelection={handleCardSelection}
        tabState={tabState}
        setTabState={setTabState}
        isLoading={isPaymentLoading}
        isFeeLoading={display.isLoading}
        orderOfficeIds={orderOfficeIds}
        totalItems={display.totalEquipment}
        totalFee={summary?.total_fee!}
        currencySymbol={summary?.currency?.symbol!}
        totalFeesArray={display.rows}
        totalFeesSummary={summary}
      />
    </div>
  );
}
