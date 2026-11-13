"use client";

import { Suspense, useEffect, useRef } from "react";
import { AlertCircle, CheckCircle, Loading02 } from "@untitledui/icons";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useGetOnboardingProgressQuery } from "@/api/baseQueries/companiesApi/onboardingApi/getOnboardingProgress";
import { useVerifySubscriptionPlanChangeQuery } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContractApi";
import { logo_black } from "@/assets/images";
import Loader from "@/components/Loader";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { useRefreshAuthSession } from "@/hooks/useRefreshAuthSession";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import routes from "@/routes";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { resolveCompleteScreenAction } from "../lib/completeScreen";
import { trackActivationStage } from "@/lib/activationAnalytics";

function CompleteContent() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref");
  const { replace } = useTransitionRouter();
  const refreshAuthSession = useRefreshAuthSession();
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const { isLoading, isError } = useVerifySubscriptionPlanChangeQuery(
    { companyId: company?.id, txRef: txRef ?? "" },
    { skip: !txRef || !company?.id },
  );

  const progressQuery = useGetOnboardingProgressQuery(
    { companyId: company?.id ?? "" },
    { skip: !company?.id || Boolean(txRef) },
  );

  const action = resolveCompleteScreenAction({
    hasCompany: Boolean(company?.id),
    hasTxRef: Boolean(txRef),
    isProgressLoading: progressQuery.isLoading,
    onboardingCompleted: progressQuery.data?.data?.onboarding_completed,
  });

  useEffect(() => {
    if (action === "redirect-signup") replace("/onboarding");
    if (action === "redirect-setup") replace("/onboarding/setup");
    if (action === "show") refreshAuthSession();
  }, [action]);

  const isVerifying = Boolean(txRef) && isLoading;
  const hasFailed = Boolean(txRef) && isError;
  const hasTrackedCompleted = useRef(false);

  useEffect(() => {
    if (action !== "show" || isVerifying || hasFailed) return;
    if (hasTrackedCompleted.current) return;
    hasTrackedCompleted.current = true;
    trackActivationStage("Completed");
  }, [action, isVerifying, hasFailed]);

  if (action !== "show") {
    return (
      <div className="grid h-screen place-content-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary px-4">
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <Image src={logo_black} alt="Rayda" className="h-8 w-auto" priority />
      </div>
      <div className="w-full max-w-[420px] rounded-2xl bg-primary p-6 text-center shadow-xl ring-1 ring-inset ring-secondary">
        <div className="flex justify-center">
          <FeaturedIcon
            icon={
              isVerifying ? Loading02 : hasFailed ? AlertCircle : CheckCircle
            }
            size="lg"
            color={isVerifying ? "gray" : hasFailed ? "error" : "success"}
            theme="light"
            className={isVerifying ? "animate-spin" : ""}
          />
        </div>

        <h1 className="mt-4 text-lg font-semibold text-primary">
          {isVerifying
            ? "Confirming your payment"
            : hasFailed
              ? "We couldn't confirm your payment"
              : "You're all set"}
        </h1>
        <p className="mt-1 text-sm text-tertiary">
          {isVerifying
            ? "Hold tight while we verify the transaction with your bank."
            : hasFailed
              ? "Your subscription hasn't been activated. You can pick your plan again from the setup wizard."
              : txRef
                ? "Your subscription is active and your workspace is ready."
                : "Your free workspace is ready — no card required."}
        </p>

        {!isVerifying && (
          <div className="mt-8 w-full">
            <Button
              color="primary"
              size="lg"
              className="w-full"
              onClick={() =>
                replace(hasFailed ? "/onboarding/setup" : routes.DASHBOARD)
              }
              data-testid="complete-button"
            >
              {hasFailed ? "Back to plan selection" : "Go to dashboard"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewOnboardingComplete() {
  return (
    <Suspense>
      <CompleteContent />
    </Suspense>
  );
}
