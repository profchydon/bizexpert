import { track } from "@/lib/analytics";

export type SubsidiaryWizardStep =
  | "details"
  | "currency"
  | "payment"
  | "confirm"
  | "done";

export type SubsidiaryWizardStatus = "reached" | "completed" | "submitted";

export function trackSubsidiaryWizard(properties: {
  step: SubsidiaryWizardStep;
  status: SubsidiaryWizardStatus;
}): void {
  track("Subsidiary Wizard", {
    step: properties.step,
    status: properties.status,
  });
}
