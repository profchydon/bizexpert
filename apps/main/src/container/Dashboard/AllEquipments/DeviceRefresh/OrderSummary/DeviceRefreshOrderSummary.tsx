"use client";
import { useCalculateDeviceRefreshFeeQuery } from "@/api/baseQueries/feesApi/calculateDeviceRefreshFee";
import PaymentMethods from "@/components/Drawers/PaymentMethods";
import ModifyOrder from "@/components/Offboarding/OrderSummary/ModifyOrder";
import OrderSummaryLayout from "@/components/Offboarding/OrderSummary/OrderSummaryLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { groupByAssignee } from "@/hooks/groupByAssigneeForOnboardingAndOffboardingInstance";
import useDeviceRefreshPayment from "@/hooks/useDeviceRefreshPayment";
import { useTaxContext } from "@/hooks/useTaxContext";
import { buildFeeRows } from "@/lib/tax/feeSummary";
import routes from "@/routes";
import { useAppSelector } from "@/store";
import { IAssetRefreshList } from "@/types/assetRefresh";
import {
  FlowSource,
  offandboardTransformToServicePayload,
} from "@/utils/offandboardTransformToServicePayload";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { buildDeviceRefreshFeePayload } from "./buildDeviceRefreshFeePayload";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import Link from "next/link";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const DeviceRefreshOrderSummary = () => {
  const { push, back } = useTransitionRouter();
  const companyId = useWorkspaceCompanyId();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const { mode: taxMode, config } = useTaxContext();
  const params = useSearchParams();
  const flowSource = params.get("flow-source") as FlowSource;
  const getCountryId = params.get("ci");
  const isDeviceRefreshFlow = Boolean(params.get("device-refresh"));

  const [redirectUrl, setRedirectUrl] = useState("");
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [tabState, setTabState] = useState<"Card" | "Credit">("Card");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isPaymentmethodOpen, setIsPaymentmethodOpen] = useState(false);
  const [note, setNote] = useState("");
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [isSignatureRequired, setIsSignatureRequired] = useState(false);
  const [finalPayload, setFinalPayload] = useState(null);

  const deviceRefreshSelectedEquipment = useAppSelector(
    (state) => state.persistedReducers.equipEmployee?.selectedEquipment,
  ) as IAssetRefreshList;

  const storageCountry = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.country,
  );

  const countryId =
    getCountryId && getCountryId !== "null"
      ? getCountryId
      : (storageCountry?.id ?? "");

  const companyCountryId = company?.country.id!;

  useEffect(() => {
    const url = `${window.location.origin}/dashboard/transactions`;
    setRedirectUrl(url);
  }, []);

  const actionsDB = useMemo(() => {
    if (!deviceRefreshSelectedEquipment) {
      return [];
    }
    if (Array.isArray(deviceRefreshSelectedEquipment)) {
      return deviceRefreshSelectedEquipment;
    }
    return [deviceRefreshSelectedEquipment];
  }, [deviceRefreshSelectedEquipment]) as IAssetRefreshList[];

  const transformActionDB = (groupByAssignee(actionsDB) as any[])?.filter(
    (group: any) => group.assignee && group.assets.length > 0,
  );

  const transformTogetFees = useMemo(
    () =>
      offandboardTransformToServicePayload({
        groupedData: transformActionDB,
        payment_method: tabState,
        flowSource,
        countryId,
        companyCountryId,
        isDeviceRefreshFlow,
        isSignatureRequired,
      }),
    [transformActionDB],
  );

  const itemsPerPage = 1;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(transformActionDB?.length / itemsPerPage);
  }, [transformActionDB, itemsPerPage]);

  const currentItems = useMemo(() => {
    return transformActionDB?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [transformActionDB, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [totalPages]);

  useEffect(() => {
    if (Object.keys(transformTogetFees).length > 0) {
      // @ts-ignore
      setFinalPayload((prev) => {
        const newPayload = buildDeviceRefreshFeePayload({
          companyId: companyId!,
          paymentMethod: isPaymentmethodOpen ? tabState : "Credit",
          companyCountryId: company?.country.id!,
          transformTogetFees,
        });

        // Only update state if the payload has actually changed
        return JSON.stringify(prev) === JSON.stringify(newPayload)
          ? prev
          : newPayload;
      });
    }
  }, [
    transformTogetFees,
    company?.country.id,
    companyId,
    isPaymentmethodOpen,
    tabState,
  ]);

  useEffect(() => {
    if (Object.keys(transformTogetFees).length < 1) {
      push("");
    }
  }, [transformTogetFees, push]);

  const {
    data: calculateDeviceRefreshFee,
    isLoading,
    isError,
  } = useCalculateDeviceRefreshFeeQuery(finalPayload as any, {
    skip: !finalPayload || !companyId,
  });
  const calculateOffboardingFeesData = calculateDeviceRefreshFee?.data;
  const totalFeesSummary = calculateOffboardingFeesData?.fee_summary;

  // Auto-enable signature requirement for orders >= $2500
  useEffect(() => {
    if ((totalFeesSummary as any)?.signature_requested) {
      setIsSignatureRequired(true);
    }
  }, [(totalFeesSummary as any)?.signature_requested]);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const togglePaymentmethod = () => {
    setIsPaymentmethodOpen(!isPaymentmethodOpen);
  };

  const { initiateDeviceRefreshPayment, isLoading: isLoadingPayment } =
    useDeviceRefreshPayment();
  const [selectedCardValue, setSelectedCardValue] = useState<string>();
  const handleCardSelection = (value: string) => {
    setSelectedCardValue(value);
  };

  const handleConfirm = async () => {
    const data = {
      payment_method: tabState,
      country_id: company?.country.id,
      redirect_url: redirectUrl,
      ...(note && { order_note: note }),
      ...(additionalEmails.length > 0 && {
        additional_recipients: additionalEmails,
      }),
      employee_country_id: countryId,
      ...transformTogetFees,
      signature_requested: isSignatureRequired,
    };

    const payload = {
      companyId: companyId!,
      payload: data,
    } as any;
    return initiateDeviceRefreshPayment(payload);
  };

  const totalFeesArray = buildFeeRows(totalFeesSummary, taxMode, config);

  const breadCrumbs = [
    <Link key="manage" className="cursor-pointer" href={routes.All_Equipments}>
      Manage equipment
    </Link>,
    <span key="summary" className="text-primary-600">
      Order Summary
    </span>,
  ];

  return (
    <div>
      <div className="flex flex-col py-8">
        <PageHeader
          breadCrumbs={breadCrumbs}
          pageTitle="Order Summary"
          pageDescription="View all the details of your order and add ons that are popular with businesses like yours"
          onBack={() => back()}
        >
          <Button
            className="text-sm space-x-2"
            disabled={
              !termsAccepted || Object.keys(transformTogetFees)?.length < 1
            }
            onClick={togglePaymentmethod}
            data-testid="devicerefreshordersummary-button"
          >
            <span className="font-semibold">Proceed to Payment</span>
          </Button>
        </PageHeader>

        <OrderSummaryLayout
          hideModifyBtn={true}
          hideAcceptanceFinal={true}
          baseRoute={""}
          selectedAsset={currentItems}
          previous={goToPreviousPage}
          next={goToNextPage}
          currentPage={currentPage}
          totalPages={totalPages}
          handlepay={togglePaymentmethod}
          companyId={companyId as string}
          setIsModifyOpen={setIsModifyOpen}
          feeData={calculateOffboardingFeesData}
          allData={actionsDB}
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          transformTogetFees={transformTogetFees}
          note={note}
          setNote={setNote}
          isError={isError}
          isLoading={isLoading}
          additionalEmails={additionalEmails}
          setAdditionalEmails={setAdditionalEmails}
          isSignatureRequired={isSignatureRequired}
          setIsSignatureRequired={setIsSignatureRequired}
        />

        {/* <CrossborderTransferNotice
          showTransferDialog={showTransferDialog}
          setShowTransferDialog={setShowTransferDialog}
          handlepay={() => setIsPaymentmethodOpen(!isPaymentmethodOpen)}
        /> */}

        <PaymentMethods
          isOpen={isPaymentmethodOpen}
          onClose={() => setIsPaymentmethodOpen(false)}
          onSave={handleConfirm}
          selectedCardValue={selectedCardValue}
          handleCardSelection={handleCardSelection}
          tabState={tabState}
          setTabState={setTabState}
          isLoading={isLoadingPayment}
          isFeeLoading={isLoading}
          totalItems={actionsDB?.length}
          totalFee={calculateOffboardingFeesData?.fee_summary?.total_fee}
          currencySymbol={
            calculateOffboardingFeesData?.fee_summary?.currency?.symbol
          }
          totalFeesArray={totalFeesArray}
          totalFeesSummary={totalFeesSummary}
        />

        <ModifyOrder
          baseRoute={""}
          isOpen={isModifyOpen}
          onClose={() => setIsModifyOpen(false)}
          equipmentData={currentItems}
          deleteAssigneeWithoutAssets={() => {}}
          //   refetch={refetch}
        />
      </div>
    </div>
  );
};

export default DeviceRefreshOrderSummary;
