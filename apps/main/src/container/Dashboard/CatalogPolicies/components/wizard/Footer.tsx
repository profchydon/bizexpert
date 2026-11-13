import { cn } from "@/lib/utils";

export function WizardFooter({
  step,
  hint,
  canProceed,
  isLastStep,
  isSubmitting = false,
  onBack,
  onClose,
  onNext,
}: {
  step: number;
  hint?: string;
  canProceed: boolean;
  isLastStep: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void | Promise<void>;
}) {
  const actionDisabled = !canProceed || (isLastStep && isSubmitting);

  return (
    <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-6 py-4">
      {step > 1 ? (
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onBack}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back
        </button>
      ) : (
        <span />
      )}
      <div className="hidden flex-1 px-3 text-xs leading-5 text-gray-500 sm:block">
        {hint}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onClose}
          className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={actionDisabled}
          onClick={onNext}
          className={cn(
            "inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-semibold shadow-sm transition",
            !actionDisabled
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "cursor-not-allowed bg-gray-100 text-gray-400",
          )}
        >
          {isLastStep
            ? isSubmitting
              ? "Creating..."
              : "Create policy"
            : "Next"}
        </button>
      </div>
    </div>
  );
}
