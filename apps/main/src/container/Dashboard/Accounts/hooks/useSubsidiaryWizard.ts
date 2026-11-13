"use client";

import { useState } from "react";
import {
  billingEntityOptionById,
  useBillingEntityOptions,
} from "../hooks/useBillingEntityOptions";
import type { BillingMode, SubsidiaryDraft } from "../types";

const EMPTY_DRAFT: SubsidiaryDraft = {
  name: "",
  email: "",
  region: null,
  currency: null,
  adminUserIds: [],
  billingMode: "self",
  billingEntityId: null,
};

export type WizardStepKey =
  "details" | "currency" | "payment" | "confirm" | "done";

const SELF_STEPS: { key: WizardStepKey; label: string }[] = [
  { key: "details", label: "Details" },
  { key: "currency", label: "Currency" },
  { key: "payment", label: "Payment" },
  { key: "done", label: "Done" },
];

const DELEGATED_STEPS: { key: WizardStepKey; label: string }[] = [
  { key: "details", label: "Details" },
  { key: "confirm", label: "Confirm" },
  { key: "done", label: "Done" },
];

export function useSubsidiaryWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [draft, setDraft] = useState<SubsidiaryDraft>(EMPTY_DRAFT);
  const [billingConfirmed, setBillingConfirmed] = useState(false);
  const { options: billingEntityOptions } = useBillingEntityOptions({
    filterByCountry: false,
  });

  const steps =
    draft.billingMode === "delegated" ? DELEGATED_STEPS : SELF_STEPS;
  const stepKey = steps[currentStep - 1]?.key ?? "details";

  function update(patch: Partial<SubsidiaryDraft>) {
    setDraft((previous) => ({ ...previous, ...patch }));
  }

  function setBillingMode(mode: BillingMode) {
    setBillingConfirmed(false);
    setDraft((previous) => ({
      ...previous,
      billingMode: mode,
      billingEntityId: null,
      currency: null,
    }));
  }

  function setBillingEntity(id: string | null) {
    setBillingConfirmed(false);
    const entity = billingEntityOptionById(billingEntityOptions, id);
    setDraft((previous) => ({
      ...previous,
      billingEntityId: id,
      currency: entity ? entity.currency : null,
    }));
  }

  function goNext() {
    setCurrentStep((step) => (step < steps.length ? step + 1 : step));
  }

  function goBack() {
    setCurrentStep((step) => (step > 1 ? step - 1 : step));
  }

  function reset() {
    setCurrentStep(1);
    setDraft(EMPTY_DRAFT);
    setBillingConfirmed(false);
  }

  function firstInvalidField(): string | null {
    if (stepKey === "details") {
      if (!draft.name.trim()) return "name";
      if (!draft.email.trim()) return "email";
      if (!draft.region) return "region";
      if (draft.adminUserIds.length === 0) return "admins";
      if (draft.billingMode === "delegated") {
        return draft.billingEntityId ? null : "billingEntity";
      }
      return draft.currency ? null : "currency";
    }
    if (stepKey === "currency" || stepKey === "confirm") {
      return billingConfirmed ? null : "confirm";
    }
    return null;
  }

  function advanceHint() {
    if (stepKey === "details") {
      return "Complete every field to continue.";
    }
    if (stepKey === "currency") {
      return "Confirm the permanent currency lock to continue.";
    }
    if (stepKey === "confirm") {
      return "Confirm the billing delegation to continue.";
    }
    if (stepKey === "payment") {
      return "You will be redirected to Stripe to add a card for this entity.";
    }
    return undefined;
  }

  function goToDone() {
    const totalSteps =
      draft.billingMode === "delegated"
        ? DELEGATED_STEPS.length
        : SELF_STEPS.length;
    setCurrentStep(totalSteps);
  }

  return {
    currentStep,
    steps,
    stepKey,
    draft,
    update,
    setBillingMode,
    setBillingEntity,
    billingConfirmed,
    setBillingConfirmed,
    goNext,
    goBack,
    goToDone,
    reset,
    advanceHint,
    firstInvalidField,
  };
}
