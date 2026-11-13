import type {
  ComplianceRequirement,
  DevicePolicy,
  EmployeeCount,
  IOnboardingAboutRequest,
  IOnboardingCompanyDetailsRequest,
  IOnboardingHardwareComplianceRequest,
  IOnboardingItSetupRequest,
  IntendedMdm,
  ItSupportStructure,
  LaptopPlatform,
  SignupPersona,
  WorkSetup,
} from "@/types/onboarding";
import type { Answers } from "./types";

const text = (answers: Answers, key: string) =>
  typeof answers[key] === "string" ? (answers[key] as string).trim() : "";

const list = (answers: Answers, key: string) =>
  Array.isArray(answers[key]) ? (answers[key] as string[]) : [];

export function buildAboutPayload(answers: Answers): IOnboardingAboutRequest {
  return {
    employee_count: text(answers, "employee_count") as EmployeeCount,
    work_setup: text(answers, "work_setup") as WorkSetup,
    signup_persona: text(answers, "signup_persona") as SignupPersona,
  };
}

export function buildItSetupPayload(
  answers: Answers,
): IOnboardingItSetupRequest {
  return {
    it_support_structure: text(
      answers,
      "it_support_structure",
    ) as ItSupportStructure,
    device_policy: text(answers, "device_policy") as DevicePolicy,
    intended_mdm: text(answers, "intended_mdm") as IntendedMdm,
    device_count: Number(text(answers, "device_count")),
  };
}

export function buildHardwareCompliancePayload(
  answers: Answers,
): IOnboardingHardwareComplianceRequest {
  return {
    laptop_platform: text(answers, "laptop_platform") as LaptopPlatform,
    compliance_requirements: list(
      answers,
      "compliance_requirements",
    ) as ComplianceRequirement[],
  };
}

export function buildCompanyDetailsPayload(
  answers: Answers,
): IOnboardingCompanyDetailsRequest {
  const tradingName = text(answers, "trading_name");

  return {
    name: text(answers, "name"),
    address: text(answers, "address"),
    country: text(answers, "country"),
    billing_currency: text(answers, "billing_currency"),
    ...(tradingName ? { trading_name: tradingName } : {}),
  };
}
