import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import formatAmount from "@/utils/formatAmount";
import { useWorkspaceEquipmentDefaults } from "@/hooks/useWorkspaceEquipmentDefaults";
import { useWorkspaceCurrencySymbol } from "@/hooks/useWorkspaceCurrencySymbol";
import {
  describeBlocker,
  describeDestinations,
  type AssignmentSummary,
} from "./destinationSummary";

interface AssignmentFooterProps {
  summary: AssignmentSummary;
  onBack: () => void;
  onConfirm: () => void;
  onJumpToUnassigned: () => void;
  isBackLoading?: boolean;
  isConfirmLoading?: boolean;
}

const AssignmentFooter: React.FC<AssignmentFooterProps> = ({
  summary,
  onBack,
  onConfirm,
  onJumpToUnassigned,
  isBackLoading = false,
  isConfirmLoading = false,
}) => {
  const currencySymbol = useWorkspaceCurrencySymbol();
  const { currencyCode } = useWorkspaceEquipmentDefaults();
  const isEmpty = summary.total === 0;
  const isComplete = summary.unassigned === 0 && summary.total > 0;
  const blocker = describeBlocker(summary);

  return (
    <div className="sticky bottom-0 z-30 border-t border-secondary bg-primary py-4 page-px">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 flex-col items-start">
          {isEmpty ? (
            <p className="text-sm font-medium text-primary">
              Nothing to order yet
            </p>
          ) : isComplete ? (
            <p className="text-sm font-medium text-primary">
              {describeDestinations(summary)}
            </p>
          ) : (
            <Button
              size="sm"
              variant="link"
              className="h-auto p-0"
              onClick={onJumpToUnassigned}
              data-testid="assignmentfooter-button"
            >
              {blocker}
            </Button>
          )}
          {!isEmpty && (
            <p className="text-xs text-tertiary">
              Fees and tax are calculated at checkout, and billed in{" "}
              {currencyCode}.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {!isEmpty && (
            <div className="text-right">
              <p className="text-xs text-tertiary">Devices subtotal</p>
              <p className="text-md font-semibold tabular-nums text-primary">
                {currencySymbol}
                {formatAmount(summary.subtotal)}
              </p>
            </div>
          )}
          <Button
            size="lg"
            variant={isEmpty ? "primary" : "outline"}
            onClick={onBack}
            isLoading={isBackLoading}
            data-testid="assignmentfooter-button-2"
          >
            Back to cart
          </Button>
          {!isEmpty &&
            (isComplete ? (
              <Button
                size="lg"
                variant="primary"
                onClick={onConfirm}
                isLoading={isConfirmLoading}
                data-testid="assignmentfooter-button-3"
              >
                Confirm & Continue
              </Button>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        size="lg"
                        variant="primary"
                        disabled
                        data-testid="assignmentfooter-button-4"
                      >
                        Confirm & Continue
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{blocker}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentFooter;
