import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  steps: string[];
  currentStep: number;
}

export function WizardStepIndicator({ steps, currentStep }: Props) {
  return (
    <ol className="flex w-full items-center gap-2">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCurrent = stepNumber === currentStep;
        const isComplete = stepNumber < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <li
            key={label}
            className={cn("flex items-center gap-3", !isLast && "flex-1")}
          >
            <div
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition",
                isCurrent && "bg-primary-700 text-white",
                isComplete && "bg-success-600 text-white",
                !isCurrent && !isComplete && "bg-gray-100 text-gray-500",
              )}
            >
              {isComplete ? <Check className="size-4" /> : stepNumber}
            </div>
            <span
              className={cn(
                "hidden shrink-0 text-sm font-medium transition sm:inline",
                isCurrent && "font-semibold text-gray-900",
                isComplete && "text-gray-700",
                !isCurrent && !isComplete && "text-gray-500",
              )}
            >
              {label}
            </span>
            {!isLast && (
              <div
                className={cn(
                  "h-px flex-1 transition",
                  isComplete ? "bg-success-600" : "bg-gray-200",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
