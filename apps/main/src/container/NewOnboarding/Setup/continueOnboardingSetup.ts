import displayErrorMessage from "@/utils/displayErrorMessage";
import { showApiError } from "@/utils/showApiError";
import type { CheckoutHandoff } from "../lib/resolveCheckoutHandoff";
import { TOTAL_STEPS } from "../data/stepMeta";
import { trackActivationStage } from "@/lib/activationAnalytics";

type SetupContinueDeps = {
  canContinue: boolean;
  setShowErrors: (show: boolean) => void;
  step: number;
  saveCurrentStep: () => Promise<void>;
  setStep: (step: number) => void;
  submitPlan: () => Promise<{ data?: { requires_payment?: boolean } }>;
  requiresPayment: boolean;
  startPayment: () => Promise<CheckoutHandoff>;
  refreshAuthSession: () => Promise<unknown>;
  push: (path: string) => void;
  completePath: string;
};

export async function continueOnboardingSetup(
  deps: SetupContinueDeps,
): Promise<void> {
  if (!deps.canContinue) {
    deps.setShowErrors(true);
    return;
  }
  deps.setShowErrors(false);

  try {
    if (deps.step < TOTAL_STEPS - 1) {
      await deps.saveCurrentStep();
      if (deps.step === TOTAL_STEPS - 2) {
        trackActivationStage("Company Information");
      }
      deps.setStep(deps.step + 1);
      return;
    }

    const response = await deps.submitPlan();
    if (response.data?.requires_payment || deps.requiresPayment) {
      const handoff = await deps.startPayment();
      if (handoff === "redirected") {
        return;
      }
      displayErrorMessage(
        "We couldn't start checkout for this plan.",
        "The plan was saved, but no payment link came back. Try again.",
      );
      return;
    }
    await deps.refreshAuthSession();
    deps.push(deps.completePath);
  } catch (error) {
    showApiError(error);
  }
}
