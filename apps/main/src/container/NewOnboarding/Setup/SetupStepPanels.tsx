import type { IPlan } from "@/types/plans";
import type { CatalogGroup } from "../lib/catalogPlans";
import type { Answers } from "../lib/types";
import { CompanyDetailsStep } from "./CompanyDetailsStep";
import { PlanSelectionStep } from "./PlanSelectionStep";
import { QuestionsStep } from "./QuestionsStep";

type Props = {
  step: number;
  answers: Answers;
  showErrors: boolean;
  onAnswer: (key: string, value: string | string[]) => void;
  plans: IPlan[];
  groups: CatalogGroup[];
  isPlansLoading: boolean;
  isPlansError: boolean;
  selectedPlan: string;
  onSelectPlan: (slug: string) => void;
};

export function SetupStepPanels({
  step,
  answers,
  showErrors,
  onAnswer,
  plans,
  groups,
  isPlansLoading,
  isPlansError,
  selectedPlan,
  onSelectPlan,
}: Props) {
  return (
    <div className="mt-6 flex-1 overflow-y-auto">
      {step < 3 && (
        <QuestionsStep
          stepIndex={step}
          answers={answers}
          showErrors={showErrors}
          onAnswer={onAnswer}
        />
      )}
      {step === 3 && (
        <CompanyDetailsStep
          answers={answers}
          showErrors={showErrors}
          onAnswer={onAnswer}
        />
      )}
      {step === 4 && (
        <PlanSelectionStep
          plans={plans}
          groups={groups}
          isLoading={isPlansLoading}
          isError={isPlansError}
          selected={selectedPlan}
          onSelect={onSelectPlan}
        />
      )}
    </div>
  );
}
