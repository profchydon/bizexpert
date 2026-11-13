"use client";
import PageHeader from "@/components/PageHeader";
import { useAppSelector } from "@/store";
import { IEmployees } from "@/types/employees";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import OrderSummaryLayout from "./OrderSummaryLayout";
import PaymentMethods from "@/components/Drawers/PaymentMethods";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import routes from "@/routes";
import Link from "next/link";
import useStorageOnboardFeeAction from "@/hooks/useStorageOnboardFeeAction";
import { useStorageOnboardingPaymentMutation } from "@/api/baseQueries/companiesApi/transactionsApi/storageOnboardingPayment";
import { useRenewStoragePaymentMutation } from "@/api/baseQueries/companiesApi/transactionsApi/renewStoragePayment";
import CrossborderTransferNotice from "./CrossborderTransferNotice";
import displayErrorMessage from "@/utils/displayErrorMessage";

const OrderSummaryContainer = () => {
  const param = useSearchParams();
  const router = useRouter();
  const renewStorage = param.get("r_int");
  const companyId = useWorkspaceCompanyId();

  const [tabState, setTabState] = useState<"Card" | "Credit">("Credit");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [note, setNote] = useState("");
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [isSignatureRequired, setIsSignatureRequired] = useState(false);

  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  ) as IEmployees[];

  const allEmployeesHaveACountry = employees?.every((employee) =>
    Boolean(employee?.country),
  );

  const storageCountry = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.country,
  );
  const isNotCrossBorder = employees.every(
    (item) =>
      item.country?.toLowerCase() === storageCountry?.name?.toLowerCase(),
  );

  const itemsPerPage = 1;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(employees?.length / itemsPerPage);

  const currentItems = employees?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const [showTransferDialog, setShowTransferDialog] = useState<boolean>(false);

  const [isPaymentmethodOpen, setIsPaymentmethodOpen] = useState(false);

  const togglePaymentmethod = () => {
    if (allEmployeesHaveACountry) {
      if (isNotCrossBorder) {
        setIsPaymentmethodOpen(true);
        setTabState("Card");
      }
      if (!isNotCrossBorder) {
        setShowTransferDialog(true);
      }
    } else {
      displayErrorMessage("All employees must have a country");
    }
  };

  const [selectedCardValue, setSelectedCardValue] = useState<string>();
  const handleCardSelection = (value: string) => {
    setSelectedCardValue(value);
  };

  const {
    payload,
    totalFeesSummary,
    totalEquipment,
    totalFeesArray,
    isLoading: isFeeLoading,
  } = useStorageOnboardFeeAction({
    employees,
    paymentMethod: tabState,
    renewInstance: !!renewStorage,
    isSignatureRequired,
  });

  // Auto-enable signature requirement for orders >= $2500
  useEffect(() => {
    if (totalFeesSummary?.signature_requested) {
      setIsSignatureRequired(true);
    }
  }, [totalFeesSummary?.signature_requested]);

  const [storageOnBoardPayment, onBoardPaymentProps] =
    useStorageOnboardingPaymentMutation();
  const [renewStoragePayment, renewStoragePaymentProps] =
    useRenewStoragePaymentMutation();

  const handleConfirm = async () => {
    const data = {
      ...payload,
      shipping_fee: 0,
      redirect_url: redirectUrl,
      ...(note && { order_note: note }),
      ...(additionalEmails.length > 0 && {
        additional_recipients: additionalEmails,
      }),
      payment_method: tabState,
    };

    try {
      const res = renewStorage
        ? await renewStoragePayment({
            companyId: companyId!,
            payload: data,
          }).unwrap()
        : await storageOnBoardPayment({
            companyId: companyId!,
            payload: data,
          }).unwrap();

      router.push(res.data.link);
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  useEffect(() => {
    const url = `${globalThis.location.origin}/dashboard/transactions`;
    setRedirectUrl(url);
  }, []);

  const getBreadCrumbs = () => {
    return [
      <Link key="storage" href={routes.STORAGE}>
        Storage
      </Link>,
      <Link key="select" href={routes.STORAGE_SELECT_EMPLOYEES}>
        Select employees
      </Link>,
      <Link key="assign" href={routes.STORAGE_ASSIGN_EMPLOYEES}>
        Assign employees
      </Link>,
      <span key="summary" className="text-primary-600">
        Order summary
      </span>,
    ];
  };

  const breadCrumbs = getBreadCrumbs();

  return (
    <div>
      <div className="flex flex-col py-8">
        <PageHeader
          breadCrumbs={breadCrumbs}
          pageTitle="Order Summary"
          pageDescription="View all the details of your order and add ons that are popular with businesses like yours"
          onBack={() => router.back()}
        >
          {/* <div className="flex gap-3">
            <Button variant="primary" onClick={togglePaymentmethod}>
              Pay
            </Button>
          </div> */}
        </PageHeader>

        <OrderSummaryLayout
          selectEmployee={currentItems}
          previous={goToPreviousPage}
          next={goToNextPage}
          currentPage={currentPage}
          totalPages={totalPages}
          handlepay={togglePaymentmethod}
          note={note}
          setNote={setNote}
          additionalEmails={additionalEmails}
          setAdditionalEmails={setAdditionalEmails}
          isSignatureRequired={isSignatureRequired}
          setIsSignatureRequired={setIsSignatureRequired}
          isAutoEnabled={
            !!totalFeesSummary?.total_fee && totalFeesSummary.total_fee >= 2500
          }
          orderTotal={totalFeesSummary?.total_fee}
        />

        <CrossborderTransferNotice
          showTransferDialog={showTransferDialog}
          setShowTransferDialog={setShowTransferDialog}
          handlepay={() => {
            setIsPaymentmethodOpen(!isPaymentmethodOpen);
            setTabState("Card");
          }}
        />

        <PaymentMethods
          isOpen={isPaymentmethodOpen}
          onClose={() => {
            setIsPaymentmethodOpen(false);
            setTabState("Credit");
          }}
          onSave={handleConfirm}
          selectedCardValue={selectedCardValue}
          handleCardSelection={handleCardSelection}
          tabState={tabState}
          setTabState={setTabState}
          isLoading={
            onBoardPaymentProps.isLoading || renewStoragePaymentProps.isLoading
          }
          isFeeLoading={isFeeLoading}
          totalFee={totalFeesSummary?.total_fee}
          totalItems={totalEquipment}
          currencySymbol={totalFeesSummary?.currency?.symbol}
          totalFeesArray={totalFeesArray}
          totalFeesSummary={totalFeesSummary}
        />
      </div>
    </div>
  );
};

export default OrderSummaryContainer;
