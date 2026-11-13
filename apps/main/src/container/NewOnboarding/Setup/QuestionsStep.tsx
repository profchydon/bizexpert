import { ALL_QUESTION_STEPS } from "../data/questionSteps";
import { STEP_META, TOTAL_STEPS } from "../data/stepMeta";
import { isDeviceCount } from "../lib/deviceCount";
import type { Answers } from "../lib/types";
import { DeviceCountField } from "./components/DeviceCountField";
import { QuestionBlock } from "./components/QuestionBlock";

export function QuestionsStep({
  stepIndex,
  answers,
  showErrors,
  onAnswer,
}: {
  stepIndex: number;
  answers: Answers;
  showErrors: boolean;
  onAnswer: (key: string, value: string | string[]) => void;
}) {
  const meta = STEP_META[stepIndex];
  const questions = ALL_QUESTION_STEPS[stepIndex];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary-600 uppercase">
          Step {stepIndex + 1} of {TOTAL_STEPS} · {meta.label}
        </p>
        <h2 className="mt-1.5 text-2xl font-bold text-gray-900">
          {meta.heading}
        </h2>
        <p className="mt-1 text-sm text-gray-500">{meta.sub}</p>
      </div>

      <div className="flex flex-col gap-10">
        {questions.map((question, index) => {
          if (question.kind === "count") {
            const stored = answers[question.key];
            const value = typeof stored === "string" ? stored : "";
            return (
              <DeviceCountField
                key={question.key}
                index={index}
                question={question.question}
                value={value}
                showError={showErrors && !isDeviceCount(value)}
                onAnswer={(next) => onAnswer(question.key, next)}
              />
            );
          }
          const answer =
            answers[question.key] ?? (question.multiSelect ? [] : "");
          const hasAnswer = Array.isArray(answer)
            ? answer.length > 0
            : answer !== "";
          return (
            <div key={question.key}>
              <QuestionBlock
                index={index}
                question={question.question}
                options={question.options}
                multiSelect={question.multiSelect}
                exclusiveOptions={question.exclusiveOptions}
                answer={answer}
                showError={showErrors && !hasAnswer}
                onAnswer={(value) => onAnswer(question.key, value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
