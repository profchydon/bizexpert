"use client";

import PageHeader from "@/components/PageHeader";
import PaymentMethods from "@/components/Drawers/PaymentMethods";
import { Button } from "@/components/ui/button";
import { useGetOffboardFeesQuery } from "@/api/baseQueries/feesApi/getOffboardFees";
import useEmployeeOffboardingOrderPayment from "@/hooks/useEmployeeOffboardingOrderPayment";
import useGroupByAssignee, {
  groupByAssignee,
} from "@/hooks/useGroupByAssignee";
import useOffboardingOrderPayment from "@/hooks/useOffboardingOrderPayment";
import { useAppSelector } from "@/store";
import { Offboard_asset } from "@/types/offboarding";
import { hasDifferentCountriesForTransfer } from "@/utils/hasDifferentCountriesForTransfer";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  transformDataForOffboardingFee,
  transformDataForOffboardingPayment,
} from "../util";
import CrossborderTransferNotice from "./CrossborderTransferNotice";
import ModifyOrder from "./ModifyOrder";
import OrderSummaryLayout from "./OrderSummaryLayout";
import { buildOffboardingLegacyFeeRows } from "./offboardingLegacyFeeRows";

const OffboardingOrderSummaryLegacy: React.FC<{
  baseRoute: string;
  breadCrumbs: React.ReactNode[];
}> = ({ baseRoute, breadCrumbs }) => {
  const param = useSearchParams();
  const isEmployeeOffboarding = param.get("isEmployeeOffboarding");
  const router = useRouter();
  const companyId = useWorkspaceCompanyId();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const [redirectUrl, setRedirectUrl] = useState("");
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [tabState, setTabState] = useState<"Card" | "Credit">("Card");
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSignatureRequired, setIsSignatureRequired] = useState(false);
  const [isPaymentmethodOpen, setIsPaymentmethodOpen] = useState(false);
  const [note, setNote] = useState("");
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCardValue, setSelectedCardValue] = useState<string>();
  const [finalPayload, setFinalPayload] = useState<Record<
    string,
    unknown
  > | null>(null);

  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset;

  const actionsDB = useMemo(() => {
    if (!offboardingData) return [];
    return Array.isArray(offboardingData) ? offboardingData : [offboardingData];
  }, [offboardingData]) as Offboard_asset[];

  const isOnlyStorageAction =
    actionsDB.length === 1 &&
    ["store", "storage"].includes(
      String(actionsDB?.[0]?.actionType || "").toLowerCase(),
    );

  const { deleteAssigneeWithoutAssets } = useGroupByAssignee(actionsDB as any);
  const transformActionDB = (groupByAssignee(actionsDB) as any[])?.filter(
    (group: any) => group.assignee && group.assets.length > 0,
  );
  const transformTogetFees = useMemo(
    () => transformDataForOffboardingFee(transformActionDB),
    [transformActionDB],
  );
  const totalPages = Math.ceil(transformActionDB?.length / 1);
  const currentItems = transformActionDB?.slice(currentPage - 1, currentPage);

  useEffect(() => {
    setRedirectUrl(`${globalThis.location.origin}/dashboard/transactions`);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [totalPages]);

  useEffect(() => {
    if (Object.keys(transformTogetFees).length > 0) {
      setFinalPayload({
        companyId,
        payment_method: isPaymentmethodOpen ? tabState : "Credit",
        country_id: company?.country.id!,
        service_type: "Offboarding",
        orders: transformTogetFees,
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
      router.push(baseRoute);
    }
  }, [transformTogetFees, baseRoute, router]);

  const {
    data: calculateFeesData,
    isLoading,
    isError,
    refetch,
  } = useGetOffboardFeesQuery(finalPayload as any, {
    skip: !finalPayload || !companyId,
  });
  const calculateOffboardingFeesData = calculateFeesData?.data;
  const totalFeesArray = buildOffboardingLegacyFeeRows(
    calculateOffboardingFeesData,
  );

  const { initiateOffboardingOrderPayment, isLoading: isLoadingPayment } =
    useOffboardingOrderPayment();
  const {
    initiateEmployeeOffboardingOrderPayment,
    isLoading: isEmployeeOffboardingPaymentLoading,
  } = useEmployeeOffboardingOrderPayment();

  const handleConfirm = async () => {
    const data = {
      payment_method: tabState,
      country_id: company?.country.id,
      redirect_url: redirectUrl,
      ...(note && { order_note: note }),
      ...(additionalEmails.length > 0 && {
        additional_recipients: additionalEmails,
      }),
      orders: transformDataForOffboardingPayment({
        items: transformActionDB,
        feeData: calculateOffboardingFeesData as any,
        isSignatureRequired,
      }),
    };

    const payload = { companyId: companyId!, payload: data };
    if (!isEmployeeOffboarding) {
      return initiateOffboardingOrderPayment(payload);
    }
    initiateEmployeeOffboardingOrderPayment(payload);
  };

  const togglePaymentmethod = () => {
    if (!hasDifferentCountriesForTransfer(actionsDB)) {
      setIsPaymentmethodOpen(!isPaymentmethodOpen);
      return;
    }
    setShowTransferDialog(true);
  };

  return (
    <div className="flex flex-col py-8">
      <PageHeader
        breadCrumbs={breadCrumbs}
        pageTitle="Order Summary"
        pageDescription="View all the details of your order and add ons that are popular with businesses like yours"
        onBack={() => router.back()}
      >
        <Button
          className="text-sm space-x-2"
          disabled={
            !termsAccepted || Object.keys(transformTogetFees).length < 1
          }
          onClick={togglePaymentmethod}
          data-testid="offboardingordersummarylegacy-button"
        >
          <span className="font-semibold">Proceed to Payment</span>
        </Button>
      </PageHeader>

      <OrderSummaryLayout
        baseRoute={baseRoute}
        selectedAsset={currentItems as Offboard_asset[]}
        previous={() => setCurrentPage((page) => Math.max(page - 1, 1))}
        next={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
        currentPage={currentPage}
        totalPages={totalPages}
        handlepay={togglePaymentmethod}
        companyId={companyId as string}
        setIsModifyOpen={setIsModifyOpen}
        feeData={calculateOffboardingFeesData as any}
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
        hideSignatureToggle={isOnlyStorageAction}
      />

      <CrossborderTransferNotice
        showTransferDialog={showTransferDialog}
        setShowTransferDialog={setShowTransferDialog}
        handlepay={() => setIsPaymentmethodOpen(true)}
      />

      <PaymentMethods
        isOpen={isPaymentmethodOpen}
        onClose={() => setIsPaymentmethodOpen(false)}
        onSave={handleConfirm}
        selectedCardValue={selectedCardValue}
        handleCardSelection={setSelectedCardValue}
        tabState={tabState}
        setTabState={setTabState}
        isLoading={isLoadingPayment || isEmployeeOffboardingPaymentLoading}
        isFeeLoading={isLoading}
        totalItems={actionsDB?.length}
        totalFee={calculateOffboardingFeesData?.fee_summary?.total_fee}
        currencySymbol={
          calculateOffboardingFeesData?.fee_summary?.currency?.symbol
        }
        totalFeesArray={totalFeesArray}
        totalFeesSummary={calculateOffboardingFeesData?.fee_summary}
      />

      <ModifyOrder
        baseRoute={baseRoute}
        isOpen={isModifyOpen}
        onClose={() => setIsModifyOpen(false)}
        equipmentData={currentItems as Offboard_asset[]}
        deleteAssigneeWithoutAssets={deleteAssigneeWithoutAssets}
        refetch={refetch}
      />
    </div>
  );
};

export default OffboardingOrderSummaryLegacy;
