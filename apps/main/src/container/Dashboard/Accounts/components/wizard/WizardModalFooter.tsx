import { Button } from "@/components/ui/button";

interface Props {
  isDone: boolean;
  showBack: boolean;
  hint?: string;
  primaryLabel: string;
  isLoading?: boolean;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
}

export function WizardModalFooter({
  isDone,
  showBack,
  hint,
  primaryLabel,
  isLoading = false,
  onBack,
  onClose,
  onNext,
}: Props) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-t border-gray-200 px-4 py-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {showBack && (
          <Button
            variant="outline"
            className="shrink-0 font-semibold text-gray-900"
            onClick={onBack}
            data-testid="wizardmodalfooter-button"
          >
            Back
          </Button>
        )}
        {!isDone && hint && (
          <p className="min-w-0 max-w-md text-sm leading-snug text-gray-500">
            {hint}
          </p>
        )}
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        {isDone ? (
          <Button onClick={onClose} data-testid="wizardmodalfooter-button-2">
            Done
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              className="font-semibold text-gray-900 hover:bg-transparent hover:text-gray-900"
              onClick={onClose}
              data-testid="wizardmodalfooter-button-3"
            >
              Cancel
            </Button>
            <Button
              className="font-semibold"
              onClick={onNext}
              isLoading={isLoading}
              disabled={isLoading}
              data-testid="wizardmodalfooter-button-4"
            >
              {primaryLabel}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
