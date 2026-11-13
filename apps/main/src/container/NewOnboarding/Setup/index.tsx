"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { logo_black } from "@/assets/images";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import routes from "@/routes";
import { PaymentOverlay } from "./components/PaymentOverlay";
import { ProgressBar } from "./components/ProgressBar";
import { SetupSidePanel } from "./components/SetupSidePanel";
import { STEP_META, TOTAL_STEPS } from "../data/stepMeta";
import { findPlanBySlug, planRequiresPayment } from "../lib/planPricing";
import { useOnboardingWizard } from "../lib/useOnboardingWizard";
import { continueOnboardingSetup } from "./continueOnboardingSetup";
import { SetupStepPanels } from "./SetupStepPanels";
import { trackActivationStage } from "@/lib/activationAnalytics";

export default function NewOnboardingSetup() {
  const { push, replace, isPending } = useTransitionRouter();
  const wizard = useOnboardingWizard();
  const {
    step,
    setStep,
    answers,
    setAnswer,
    selectedPlan,
    setSelectedPlan,
    showErrors,
    setShowErrors,
    canContinue,
    isSaving,
    isRedirectingToPayment,
    plans,
    groups,
    plansQuery,
    progressQuery,
    companyId,
    completePath,
  } = wizard;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !companyId) replace("/onboarding");
  }, [isMounted, companyId]);

  const [isLeavingWizard, setIsLeavingWizard] = useState(false);
  const hasAttemptedExit = useRef(false);
  const hasTrackedOnboarding = useRef(false);

  useEffect(() => {
    if (!companyId || progressQuery.isLoading || isLeavingWizard) return;
    if (hasTrackedOnboarding.current) return;
    hasTrackedOnboarding.current = true;
    trackActivationStage("Onboarding");
  }, [companyId, progressQuery.isLoading, isLeavingWizard]);

  useEffect(() => {
    if (!progressQuery.data?.data?.onboarding_completed) return;
    if (hasAttemptedExit.current) return;

    hasAttemptedExit.current = true;
    setIsLeavingWizard(true);
    wizard
      .refreshAuthSession()
      .then((refreshed) => {
        if (refreshed) replace(routes.DASHBOARD);
        else setIsLeavingWizard(false);
      })
      .catch(() => setIsLeavingWizard(false));
  }, [progressQuery.data]);

  function handleBack() {
    setShowErrors(false);
    if (step === 0) {
      push("/onboarding");
      return;
    }
    setStep(step - 1);
  }

  const isPaidPlan = planRequiresPayment(findPlanBySlug(plans, selectedPlan));

  async function handleNext() {
    await continueOnboardingSetup({
      canContinue,
      setShowErrors,
      step,
      saveCurrentStep: () => wizard.saveCurrentStep(),
      setStep,
      submitPlan: () => wizard.submitPlan(),
      requiresPayment: isPaidPlan,
      startPayment: () => wizard.startPayment(),
      refreshAuthSession: () => wizard.refreshAuthSession(),
      push,
      completePath,
    });
  }

  const isBusy = isSaving || isRedirectingToPayment;
  const isPlanStep = step === TOTAL_STEPS - 1;
  const isResolvingProgress =
    !companyId || progressQuery.isLoading || isLeavingWizard;

  if (isResolvingProgress) {
    return (
      <div className="grid h-screen place-content-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden w-[420px] shrink-0 lg:block xl:w-[480px]">
        <SetupSidePanel step={step} />
      </div>

      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3 lg:hidden">
          <Image src={logo_black} alt="Rayda" className="h-7 w-auto" priority />
        </div>

        <div className="flex flex-1 flex-col overflow-hidden px-8 py-6 lg:px-12 lg:py-8">
          <div className="flex shrink-0 flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500">
                {STEP_META[step].label}
              </p>
              <p className="text-xs text-gray-500">
                {step + 1} / {TOTAL_STEPS}
              </p>
            </div>
            <ProgressBar current={step} total={TOTAL_STEPS} />
          </div>

          <SetupStepPanels
            step={step}
            answers={answers}
            showErrors={showErrors}
            onAnswer={setAnswer}
            plans={plans}
            groups={groups}
            isPlansLoading={plansQuery.isFetching || plansQuery.isUninitialized}
            isPlansError={plansQuery.isError}
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
          />

          <div className="mt-4 flex shrink-0 flex-col gap-2 border-t border-gray-200 pt-4">
            {showErrors && !canContinue && (
              <p className="text-center text-xs text-error-600">
                Please fill in all fields to continue.
              </p>
            )}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="md"
                className="gap-2 text-sm"
                disabled={isBusy}
                isLoading={step === 0 && isPending}
                onClick={handleBack}
                data-testid="setup-button"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <Button
                size="md"
                className="gap-2 text-sm"
                isLoading={isSaving || isPending}
                disabled={isPlanStep && !selectedPlan}
                onClick={handleNext}
                data-testid="setup-button-2"
              >
                {step === 4
                  ? isPaidPlan
                    ? "Make Payment"
                    : "Start mission"
                  : "Continue"}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isRedirectingToPayment && <PaymentOverlay />}
    </div>
  );
}
