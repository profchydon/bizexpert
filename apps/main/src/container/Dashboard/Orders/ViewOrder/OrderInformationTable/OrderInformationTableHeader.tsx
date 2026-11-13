import React from "react";
import { X } from "lucide-react";
import { fullBleedBorderBottomSectionClass } from "@/components/application/dividers/fullBleedDividerClasses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  employeeCount: number | null;
  canUpdateSignature?: boolean;
  showMakeSignatureButton: boolean;
  showRemoveSignatureButton: boolean;
  isStorageSelectionBlocked: boolean;
  hasVerificationPendingRows: boolean;
  selectedVerificationPendingCount: number;
  onMakeSignatureRequired?: () => void;
  onRemoveSignatureRequired?: () => void;
  onVerifyAllPending?: () => void;
}

const OrderInformationTableHeader: React.FC<Props> = ({
  employeeCount,
  canUpdateSignature,
  showMakeSignatureButton,
  showRemoveSignatureButton,
  isStorageSelectionBlocked,
  hasVerificationPendingRows,
  selectedVerificationPendingCount,
  onMakeSignatureRequired,
  onRemoveSignatureRequired,
  onVerifyAllPending,
}) => (
  <div className={fullBleedBorderBottomSectionClass}>
    <div className="flex min-w-0 flex-row items-center justify-between px-6 py-4">
      <h3 className="flex flex-row items-center gap-3 text-lg font-semibold text-gray-900">
        Order information
        {employeeCount ? (
          <Badge className="bg-primary-25 text-primary-700 hover:bg-primary-25">
            {employeeCount} {employeeCount === 1 ? "Employee" : "Employees"}
          </Badge>
        ) : null}
      </h3>
      <div className="flex shrink-0 items-center gap-2">
        {canUpdateSignature &&
          showMakeSignatureButton &&
          !isStorageSelectionBlocked && (
            <Button
              variant="primary"
              size="sm"
              className="gap-2"
              onClick={() => onMakeSignatureRequired?.()}
              data-testid="orderinformationtableheader-button"
            >
              Make signature required
            </Button>
          )}
        {canUpdateSignature && showRemoveSignatureButton && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-error-200 text-error-600 hover:bg-error-50"
            onClick={() => onRemoveSignatureRequired?.()}
            data-testid="orderinformationtableheader-button-2"
          >
            <X className="h-4 w-4" />
            Remove signature required
          </Button>
        )}
        {hasVerificationPendingRows && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => onVerifyAllPending?.()}
            data-testid="orderinformationtableheader-button-3"
          >
            Verify all pending
            {selectedVerificationPendingCount > 0 && (
              <Badge className="bg-primary-25 text-primary-700 hover:bg-primary-25">
                {selectedVerificationPendingCount}
              </Badge>
            )}
          </Button>
        )}
      </div>
    </div>
  </div>
);

export default OrderInformationTableHeader;
