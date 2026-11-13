"use client";

import type { CustomerPlan } from "../data/plans";

export type IntakeOutcome = "none" | "shortfall" | "surplus" | "wrong_item";

export interface StorageFixtures {
  plan: CustomerPlan;
  alreadyErased: boolean;
  impactEmpty: boolean;
  readOnly: boolean;
  forceSubmitError: boolean;
  intakeOutcome: IntakeOutcome;
}

export function useStorageFixtures(): StorageFixtures {
  return {
    plan: "enterprise",
    alreadyErased: false,
    impactEmpty: false,
    readOnly: false,
    forceSubmitError: false,
    intakeOutcome: "none",
  };
}
