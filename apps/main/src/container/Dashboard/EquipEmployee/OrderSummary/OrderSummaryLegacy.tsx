"use client";

import PageHeader from "@/components/PageHeader";
import PaymentMethods from "@/components/Drawers/PaymentMethods";
import { useGetCatalogQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalog";
import { useBuyToStoragePaymentMutation } from "@/api/baseQueries/companiesApi/transactionsApi/buyToStoragePayment";
import { useOnboardingPaymentMutation } from "@/api/baseQueries/companiesApi/transactionsApi/onboardingPayment";
import useOnboardFeeAction from "@/hooks/useOnboardFeeAction";
import { useAppSelector } from "@/store";
import { IEmployees } from "@/types/employees";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import OrderSummaryLayout from "./OrderSummaryLayout";
import { buildEquipOrderSummaryLegacyBreadcrumbs } from "./orderSummaryLegacyBreadcrumbs";

const OrderSummaryLegacy = () => {
  const param = useSearchParams();
  const catalogId = param.get("catalogId") as string;
  const router = useRouter();
  const companyId = useWorkspaceCompanyId();
  const [tabState, setTabState] = useState<"Card" | "Credit">("Credit");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [note, setNote] = useState("");
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [isSignatureRequired, setIsSignatureRequired] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaymentmethodOpen, setIsPaymentmethodOpen] = useState(false);
  const [selectedCardValue, setSelectedCardValue] = useState<string>();

  const { data: catalogRes } = useGetCatalogQuery(
    { catalogId, companyId: companyId! },
    { skip: !catalogId },
  );
  const catalog = catalogRes?.data;

  const employees = useAppSelector(
    (state) => state.persistedReducers.employee?.selectedEmployee,
  ) as IEmployees[];

  const getEmployeeCountryId = () => employees?.[0]?.country_id;
  const itemsPerPage = 1;
  const totalPages = Math.ceil(employees?.length / itemsPerPage);
  const currentItems = employees?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const isUnassigned = currentItems[0]?.id === UNASSIGNED_ORDER_SUMMARY_KEY;

  const {
    payload,
    totalFeesSummary,
    totalEquipment,
    totalFeesArray,
    isError,
    isLoading,
  } = useOnboardFeeAction({
    employees,
    paymentMethod: tabState,
    buyToStorage: isUnassigned,
    employeeCountry: getEmployeeCountryId(),
    isSignatureRequired,
  });

  const [onBoardPayment, onBoardPaymentProps] = useOnboardingPaymentMutation();
  const [buyToStoragePayment, buyToStoragePaymentProps] =
    useBuyToStoragePaymentMutation();

  useEffect(() => {
    if (totalFeesSummary?.signature_requested) {
      setIsSignatureRequired(true);
    }
  }, [totalFeesSummary?.signature_requested]);

  useEffect(() => {
    setRedirectUrl(`${globalThis.location.origin}/dashboard/transactions`);
  }, []);

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

    const mutation = isUnassigned ? buyToStoragePayment : onBoardPayment;
    const res = await mutation({
      companyId: companyId!,
      payload: data,
    }).unwrap();
    router.push(res.data.link);
  };

  const breadCrumbs = buildEquipOrderSummaryLegacyBreadcrumbs({
    catalog,
    isUnassigned,
  });

  return (
    <div className="flex flex-col py-8">
      <PageHeader
        breadCrumbs={breadCrumbs}
        pageTitle="Order Summary"
        pageDescription="View all the details of your order and add ons that are popular with businesses like yours"
        onBack={() => router.back()}
      />

      <OrderSummaryLayout
        selectEmployee={currentItems as IEmployees[]}
        previous={() => setCurrentPage((page) => Math.max(page - 1, 1))}
        next={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
        currentPage={currentPage}
        totalPages={totalPages}
        handlepay={() => {
          setIsPaymentmethodOpen(true);
          setTabState("Card");
        }}
        currencySymbol={totalFeesSummary?.currency?.symbol!}
        totalFee={totalFeesSummary?.total_fee!}
        totalEquipment={totalEquipment}
        totalFeesArray={totalFeesArray}
        totalFeesSummary={totalFeesSummary}
        isError={isError}
        isLoading={isLoading}
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

      <PaymentMethods
        isOpen={isPaymentmethodOpen}
        onClose={() => {
          setIsPaymentmethodOpen(false);
          setTabState("Credit");
        }}
        onSave={handleConfirm}
        selectedCardValue={selectedCardValue}
        handleCardSelection={setSelectedCardValue}
        tabState={tabState}
        setTabState={setTabState}
        isLoading={
          onBoardPaymentProps.isLoading || buyToStoragePaymentProps.isLoading
        }
        isFeeLoading={isLoading}
        totalItems={totalEquipment}
        totalFee={totalFeesSummary?.total_fee!}
        currencySymbol={totalFeesSummary?.currency?.symbol!}
        totalFeesArray={totalFeesArray}
        totalFeesSummary={totalFeesSummary}
      />
    </div>
  );
};

export default OrderSummaryLegacy;
