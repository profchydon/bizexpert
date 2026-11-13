import React from "react";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  multi: boolean;
  isFirst: boolean;
  isLast: boolean;
  canProceed: boolean;
  proceedDisabledReason?: string;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onProceed: () => void;
  isCancelLoading?: boolean;
  isProceedLoading?: boolean;
}

const OnboardDevicesFooter: React.FC<Props> = ({
  multi,
  isFirst,
  isLast,
  canProceed,
  proceedDisabledReason,
  onCancel,
  onPrevious,
  onNext,
  onProceed,
  isCancelLoading = false,
  isProceedLoading = false,
}) => {
  const showProceed = !multi || isLast;
  const proceedLabel = multi ? "Review Order" : "Proceed to Checkout";

  return (
    <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-5">
      <Button
        type="button"
        variant="outline"
        className="h-11 px-4 text-sm font-semibold text-gray-700"
        onClick={onCancel}
        isLoading={isCancelLoading}
        data-testid="onboarddevicesfooter-button"
      >
        Cancel
      </Button>

      <div className="flex items-center gap-2">
        {multi && (
          <Button
            type="button"
            variant="outline"
            className="h-11 gap-2 px-4 text-sm font-semibold text-gray-700"
            disabled={isFirst}
            onClick={onPrevious}
            data-testid="onboarddevicesfooter-button-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous Employee
          </Button>
        )}
        {multi && !isLast && (
          <Button
            type="button"
            variant="outline"
            className="h-11 gap-2 px-4 text-sm font-semibold text-gray-700"
            onClick={onNext}
            data-testid="onboarddevicesfooter-button-3"
          >
            Next Employee
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        {showProceed && !canProceed && proceedDisabledReason && (
          <span className="flex max-w-[260px] items-center gap-1.5 text-xs font-medium text-amber-600">
            <Info className="h-4 w-4 shrink-0" />
            {proceedDisabledReason}
          </span>
        )}
        {showProceed && (
          <Button
            type="button"
            variant="primary"
            className="h-11 gap-2 px-4 text-sm font-semibold"
            disabled={!canProceed}
            title={canProceed ? undefined : proceedDisabledReason}
            onClick={onProceed}
            isLoading={isProceedLoading}
            data-testid="onboarddevicesfooter-button-4"
          >
            {proceedLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardDevicesFooter;
