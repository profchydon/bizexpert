import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const steps = ["Basics", "Match criteria", "Kit & storage"];

export function WizardStepper({ step }: { step: number }) {
  return (
    <ol className="flex w-full items-center gap-2">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCurrent = stepNumber === step;
        const isComplete = stepNumber < step;
        const isLast = index === steps.length - 1;

        return (
          <li
            key={label}
            className={cn("flex items-center gap-3", !isLast && "flex-1")}
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition",
                isCurrent && "bg-primary-600 text-white",
                isComplete && "bg-success-600 text-white",
                stepNumber > step && "bg-gray-100 text-gray-500",
              )}
            >
              {isComplete ? <Check className="h-4 w-4" /> : stepNumber}
            </span>
            <span
              className={cn(
                "hidden shrink-0 text-sm font-medium transition sm:inline",
                isCurrent ? "text-gray-900" : "text-gray-500",
                isComplete && "text-gray-700",
              )}
            >
              {label}
            </span>
            {!isLast ? (
              <span
                className={cn(
                  "h-px flex-1 transition",
                  isComplete ? "bg-success-600" : "bg-gray-200",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
