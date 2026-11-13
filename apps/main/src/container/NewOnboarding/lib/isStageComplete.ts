import { ALL_QUESTION_STEPS } from "../data/questionSteps";
import { isDeviceCount } from "./deviceCount";
import type { Answers } from "./types";

const COMPANY_DETAIL_REQUIRED_KEYS = [
  "name",
  "address",
  "country",
  "billing_currency",
];

export function isStageComplete(
  step: number,
  answers: Answers,
  selectedPlan: string,
) {
  if (step < 3) {
    return ALL_QUESTION_STEPS[step].every((question) => {
      const answer = answers[question.key];
      if (question.kind === "count") return isDeviceCount(answer);
      return Array.isArray(answer)
        ? answer.length > 0
        : typeof answer === "string" && answer !== "";
    });
  }

  if (step === 3) {
    return COMPANY_DETAIL_REQUIRED_KEYS.every((key) => {
      const answer = answers[key];
      return typeof answer === "string" && answer.trim() !== "";
    });
  }

  return selectedPlan !== "";
}
