import { track } from "@/lib/analytics";

export type ActivationStage =
  | "Verification"
  | "Company Information"
  | "Onboarding"
  | "Completed";

export function trackSignupStarted(): void {
  track("Signup Started");
}

export function trackCompanyProfileCompleted(): void {
  track("Company Profile Completed");
}

export function trackOnboardingCompleted(): void {
  track("Onboarding Completed");
}

export function trackFirstCountrySelected(): void {
  track("First Country Selected");
}

export function trackActivationStage(stage: ActivationStage): void {
  if (stage === "Verification" || stage === "Onboarding") {
    trackSignupStarted();
    return;
  }

  if (stage === "Company Information") {
    trackCompanyProfileCompleted();
    return;
  }

  if (stage === "Completed") {
    trackOnboardingCompleted();
  }
}
