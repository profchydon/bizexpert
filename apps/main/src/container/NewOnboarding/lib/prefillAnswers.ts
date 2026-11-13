import type { IOnboardingProgress } from "@/types/onboarding";
import { isDeviceCount } from "./deviceCount";
import type { Answers } from "./types";

function put(answers: Answers, key: string, value?: string | null) {
  if (value) answers[key] = value;
}

export function prefillAnswers(progress?: IOnboardingProgress): Answers {
  const answers: Answers = {};
  if (!progress) return answers;

  put(answers, "employee_count", progress.about?.employee_count);
  put(answers, "work_setup", progress.about?.work_setup);
  put(answers, "signup_persona", progress.about?.signup_persona);

  put(answers, "it_support_structure", progress.it_setup?.it_support_structure);
  put(answers, "device_policy", progress.it_setup?.device_policy);
  put(answers, "intended_mdm", progress.it_setup?.intended_mdm);
  const deviceCount = progress.it_setup?.device_count;
  if (isDeviceCount(deviceCount == null ? "" : String(deviceCount))) {
    answers.device_count = String(deviceCount);
  }

  put(
    answers,
    "laptop_platform",
    progress.hardware_compliance?.laptop_platform,
  );
  const compliance = progress.hardware_compliance?.compliance_requirements;
  if (compliance?.length) answers.compliance_requirements = [...compliance];

  put(answers, "name", progress.company_details?.name);
  put(answers, "trading_name", progress.company_details?.trading_name);
  put(answers, "address", progress.company_details?.address);
  put(answers, "country", progress.company_details?.country);
  put(answers, "billing_currency", progress.company_details?.billing_currency);

  return answers;
}

const TOTAL_API_STEPS = 5;

export function resumeStepFrom(progress?: IOnboardingProgress) {
  if (!progress) return 0;

  const completed = Array.isArray(progress.completed_steps)
    ? progress.completed_steps
    : [];

  for (let apiStep = 1; apiStep <= TOTAL_API_STEPS; apiStep += 1) {
    if (!completed.includes(apiStep)) return apiStep - 1;
  }

  return TOTAL_API_STEPS - 1;
}
