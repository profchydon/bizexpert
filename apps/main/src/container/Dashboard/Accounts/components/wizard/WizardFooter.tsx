import { Button } from "@/components/ui/button";

interface Props {
  isDone: boolean;
  showBack: boolean;
  hint?: string;
  primaryLabel: string;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
}

export function WizardFooter({
  isDone,
  showBack,
  hint,
  primaryLabel,
  onBack,
  onClose,
  onNext,
}: Props) {
  return (
    <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-gray-200 px-4 py-4 sm:px-6">
      <div className="justify-self-start">
        {showBack && (
          <Button
            variant="outline"
            size="md"
            className="font-semibold text-gray-700"
            onClick={onBack}
            data-testid="wizardfooter-button"
          >
            Back
          </Button>
        )}
      </div>

      {!isDone && hint ? (
        <p className="max-w-xs text-center text-xs text-gray-500 sm:max-w-md">
          {hint}
        </p>
      ) : (
        <span />
      )}

      <div className="justify-self-end flex items-center gap-2">
        {isDone ? (
          <Button
            size="md"
            onClick={onClose}
            data-testid="wizardfooter-button-2"
          >
            Done
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              size="md"
              className="font-semibold text-gray-700 hover:bg-transparent hover:text-gray-900"
              onClick={onClose}
              data-testid="wizardfooter-button-3"
            >
              Cancel
            </Button>
            <Button
              size="md"
              onClick={onNext}
              data-testid="wizardfooter-button-4"
            >
              {primaryLabel}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
