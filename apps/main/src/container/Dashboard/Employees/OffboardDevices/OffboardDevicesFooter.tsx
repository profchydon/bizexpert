import React from "react";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  multi: boolean;
  isFirst: boolean;
  isLast: boolean;
  canReview: boolean;
  reviewDisabledReason?: string;
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onReview: () => void;
  isCancelLoading?: boolean;
  isReviewLoading?: boolean;
}

const OffboardDevicesFooter: React.FC<Props> = ({
  multi,
  isFirst,
  isLast,
  canReview,
  reviewDisabledReason,
  onCancel,
  onPrevious,
  onNext,
  onReview,
  isCancelLoading = false,
  isReviewLoading = false,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-5">
      <Button
        type="button"
        variant="outline"
        className="h-11 px-4 text-sm font-semibold text-gray-700"
        onClick={onCancel}
        isLoading={isCancelLoading}
        data-testid="offboarddevicesfooter-button"
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
            data-testid="offboarddevicesfooter-button-2"
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
            data-testid="offboarddevicesfooter-button-3"
          >
            Next Employee
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        {!canReview && reviewDisabledReason && (
          <span className="flex max-w-[260px] items-center gap-1.5 text-xs font-medium text-amber-600">
            <Info className="h-4 w-4 shrink-0" />
            {reviewDisabledReason}
          </span>
        )}
        <Button
          type="button"
          variant="primary"
          className="h-11 gap-2 px-4 text-sm font-semibold"
          disabled={!canReview}
          title={canReview ? undefined : reviewDisabledReason}
          onClick={onReview}
          isLoading={isReviewLoading}
          data-testid="offboarddevicesfooter-button-4"
        >
          Review Order
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default OffboardDevicesFooter;
