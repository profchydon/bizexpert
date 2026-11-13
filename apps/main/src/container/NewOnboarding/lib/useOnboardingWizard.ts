"use client";

import { useEffect, useState } from "react";
import { useGetOnboardingProgressQuery } from "@/api/baseQueries/companiesApi/onboardingApi/getOnboardingProgress";
import { useSaveOnboardingAboutMutation } from "@/api/baseQueries/companiesApi/onboardingApi/saveAbout";
import { useSaveOnboardingCompanyDetailsMutation } from "@/api/baseQueries/companiesApi/onboardingApi/saveCompanyDetails";
import { useSaveOnboardingHardwareComplianceMutation } from "@/api/baseQueries/companiesApi/onboardingApi/saveHardwareCompliance";
import { useSaveOnboardingItSetupMutation } from "@/api/baseQueries/companiesApi/onboardingApi/saveItSetup";
import { useSelectOnboardingPlanMutation } from "@/api/baseQueries/companiesApi/onboardingApi/selectPlan";
import { useChangeSubscriptionPlanMutation } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContractApi";
import { usePlansQuery } from "@/api/baseQueries/plansApi/plans";
import { useRefreshAuthSession } from "@/hooks/useRefreshAuthSession";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { TOTAL_STEPS } from "../data/stepMeta";
import {
  buildOnboardingCheckout,
  buildPlanSelectionPayload,
} from "./checkoutPayload";
import { resolveCheckoutHandoff } from "./resolveCheckoutHandoff";
import { isStageComplete } from "./isStageComplete";
import {
  buildAboutPayload,
  buildCompanyDetailsPayload,
  buildHardwareCompliancePayload,
  buildItSetupPayload,
} from "./payloads";
import { catalogGroups, catalogPlans } from "./catalogPlans";
import { selectablePlans } from "./planPresentation";
import { findPlanBySlug } from "./planPricing";
import { prefillAnswers, resumeStepFrom } from "./prefillAnswers";
import type { Answers } from "./types";

const COMPLETE_PATH = "/onboarding/complete";

const PLAN_STEP = TOTAL_STEPS - 1;

export function useOnboardingWizard() {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = company?.id ?? "";
  const refreshAuthSession = useRefreshAuthSession();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selectedPlan, setSelectedPlan] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);

  const progressQuery = useGetOnboardingProgressQuery(
    { companyId },
    { skip: !companyId },
  );
  const plansQuery = usePlansQuery(undefined, {
    skip: step !== PLAN_STEP,
    refetchOnMountOrArgChange: true,
  });
  const planPayload = plansQuery.data?.data;
  const plans = selectablePlans(catalogPlans(planPayload));
  const groups = catalogGroups(planPayload);

  const [saveAbout, aboutProps] = useSaveOnboardingAboutMutation();
  const [saveItSetup, itSetupProps] = useSaveOnboardingItSetupMutation();
  const [saveHardware, hardwareProps] =
    useSaveOnboardingHardwareComplianceMutation();
  const [saveCompanyDetails, companyDetailsProps] =
    useSaveOnboardingCompanyDetailsMutation();
  const [selectPlan, planProps] = useSelectOnboardingPlanMutation();
  const [changePlan, changeProps] = useChangeSubscriptionPlanMutation();

  useEffect(() => {
    const progress = progressQuery.data?.data;
    if (!progress || isHydrated) return;
    setAnswers(prefillAnswers(progress));
    setSelectedPlan(progress.plan?.plan_slug ?? "");
    setStep(resumeStepFrom(progress));
    setIsHydrated(true);
  }, [progressQuery.data, isHydrated]);

  const canContinue = isStageComplete(step, answers, selectedPlan);
  const isSaving =
    aboutProps.isLoading ||
    itSetupProps.isLoading ||
    hardwareProps.isLoading ||
    companyDetailsProps.isLoading ||
    planProps.isLoading ||
    changeProps.isLoading;

  function setAnswer(key: string, value: string | string[]) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setShowErrors(false);
  }

  async function saveCurrentStep() {
    if (step === 0) {
      await saveAbout({ companyId, ...buildAboutPayload(answers) }).unwrap();
      return;
    }
    if (step === 1) {
      await saveItSetup({
        companyId,
        ...buildItSetupPayload(answers),
      }).unwrap();
      return;
    }
    if (step === 2) {
      await saveHardware({
        companyId,
        ...buildHardwareCompliancePayload(answers),
      }).unwrap();
      return;
    }
    await saveCompanyDetails({
      companyId,
      ...buildCompanyDetailsPayload(answers),
    }).unwrap();
  }

  async function startPayment() {
    const checkout = buildOnboardingCheckout(
      companyId,
      findPlanBySlug(plans, selectedPlan)?.id ?? "",
    );
    if (!checkout) return "failed" as const;

    const response = await changePlan(checkout).unwrap();
    const handoff = resolveCheckoutHandoff(response);
    const link = response.data?.collection?.link;
    if (handoff === "redirected" && link) {
      setIsRedirectingToPayment(true);
      globalThis.location.assign(link);
    }
    return handoff;
  }

  return {
    company,
    companyId,
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
    isPlanStep: step === TOTAL_STEPS - 1,
    saveCurrentStep,
    startPayment,
    refreshAuthSession,
    submitPlan: () =>
      selectPlan(buildPlanSelectionPayload(companyId, selectedPlan)).unwrap(),
    completePath: COMPLETE_PATH,
  };
}
