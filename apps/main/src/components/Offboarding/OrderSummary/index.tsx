"use client";
import PageHeader from "@/components/PageHeader";
import { useAppSelector } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import OrderSummaryLayout from "./OrderSummaryLayout";
import PaymentMethods from "@/components/Drawers/PaymentMethods";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { Offboard_asset } from "@/types/offboarding";
import { Button } from "@/components/ui/button";
import ModifyOrder from "./ModifyOrder";
import { hasDifferentCountriesForTransfer } from "../../../utils/hasDifferentCountriesForTransfer";
import CrossborderTransferNotice from "./CrossborderTransferNotice";
import useGroupByAssignee, {
  groupByAssignee,
} from "@/hooks/useGroupByAssignee";
import {
  transformDataForOffboardingFee,
  transformDataForOffboardingPayment,
} from "../util";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useGetOffboardFeesQuery } from "@/api/baseQueries/feesApi/getOffboardFees";
import useOffboardingOrderPayment from "@/hooks/useOffboardingOrderPayment";
import useEmployeeOffboardingOrderPayment from "@/hooks/useEmployeeOffboardingOrderPayment";
import { useTaxContext } from "@/hooks/useTaxContext";
import { buildFeeRows } from "@/lib/tax/feeSummary";
import { useOffboardingOrderSummaryAnalytics } from "./useOffboardingOrderSummaryAnalytics";

const OffboardingOrderSummary: React.FC<{
  baseRoute: string;
  breadCrumbs: any[];
}> = ({ baseRoute, breadCrumbs }) => {
  const param = useSearchParams();
  const isEmployeeOffboarding = param.get("isEmployeeOffboarding");
  const router = useRouter();
  const companyId = useWorkspaceCompanyId();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const { mode: taxMode, config } = useTaxContext();
  const [redirectUrl, setRedirectUrl] = useState("");
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [tabState, setTabState] = useState<"Card" | "Credit">("Card");
  const [showTransferDialog, setShowTransferDialog] = useState<boolean>(false);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSignatureRequired, setIsSignatureRequired] = useState(false);
  const [isPaymentmethodOpen, setIsPaymentmethodOpen] = useState(false);
  const [note, setNote] = useState("");
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);

  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset;

  useEffect(() => {
    const url = `${window.location.origin}/dashboard/transactions`;
    setRedirectUrl(url);
  }, []);

  const actionsDB = useMemo(() => {
    if (!offboardingData) {
      return [];
    }
    if (Array.isArray(offboardingData)) {
      return offboardingData;
    }
    return [offboardingData];
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

  const [finalPayload, setFinalPayload] = useState(null);

  useEffect(() => {
    if (Object.keys(transformTogetFees).length > 0) {
      // @ts-ignore
      setFinalPayload((prev) => {
        const newPayload = {
          companyId,
          payment_method: isPaymentmethodOpen ? tabState : "Credit",
          country_id: company?.country.id!,
          service_type: "Offboarding",
          orders: transformTogetFees,
        };

        // Only update state if the payload has actually changed
        return JSON.stringify(prev) === JSON.stringify(newPayload)
          ? prev
          : newPayload;
      });
    }
  }, [transformTogetFees, company?.country.id, companyId, isPaymentmethodOpen]);

  useEffect(() => {
    if (Object.keys(transformTogetFees).length < 1) {
      router.push(baseRoute);
    }
  }, [transformTogetFees]);

  const {
    data: calculateFeesData,
    isLoading,
    isError,
    refetch,
  } = useGetOffboardFeesQuery(finalPayload as any, {
    skip: !finalPayload || !companyId,
  });
  const calculateOffboardingFeesData = calculateFeesData?.data;
  const { trackConfirmed } = useOffboardingOrderSummaryAnalytics({
    actionsDB,
    calculateOffboardingFeesData,
    isLoadingFees: isLoading,
    taxMode,
    transformTogetFees,
  });

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const togglePaymentmethod = () => {
    const compareTranferCountry = hasDifferentCountriesForTransfer(actionsDB);
    if (!compareTranferCountry) {
      return setIsPaymentmethodOpen(!isPaymentmethodOpen);
    }
    return setShowTransferDialog(true);
  };

  const { initiateOffboardingOrderPayment, isLoading: isLoadingPayment } =
    useOffboardingOrderPayment();
  const {
    initiateEmployeeOffboardingOrderPayment,
    isLoading: isEmployeeOffboardingPaymentLoading,
  } = useEmployeeOffboardingOrderPayment();

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
      orders: transformDataForOffboardingPayment({
        items: transformActionDB,
        feeData: calculateOffboardingFeesData as any,
        isSignatureRequired,
        isEmployeeOffboarding: Boolean(isEmployeeOffboarding),
      }),
    };

    const payload = {
      companyId: companyId!,
      payload: data,
    } as any;

    const result = !isEmployeeOffboarding
      ? await initiateOffboardingOrderPayment(payload)
      : await initiateEmployeeOffboardingOrderPayment(payload);

    if (!result) return;
    trackConfirmed(result);
  };

  const totalFeesArray = buildFeeRows(
    calculateOffboardingFeesData?.fee_summary,
    taxMode,
    config,
  );

  return (
    <div>
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
            data-testid="ordersummary-button"
          >
            <span className="font-semibold">Proceed to Payment</span>
          </Button>
        </PageHeader>

        <OrderSummaryLayout
          baseRoute={baseRoute}
          selectedAsset={currentItems as Offboard_asset[]}
          previous={goToPreviousPage}
          next={goToNextPage}
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
          hideModifyBtn={Boolean(isEmployeeOffboarding)}
        />

        <CrossborderTransferNotice
          showTransferDialog={showTransferDialog}
          setShowTransferDialog={setShowTransferDialog}
          handlepay={() => setIsPaymentmethodOpen(!isPaymentmethodOpen)}
        />

        <PaymentMethods
          isOpen={isPaymentmethodOpen}
          onClose={() => setIsPaymentmethodOpen(false)}
          onSave={handleConfirm}
          selectedCardValue={selectedCardValue}
          handleCardSelection={handleCardSelection}
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
    </div>
  );
};

export default OffboardingOrderSummary;
