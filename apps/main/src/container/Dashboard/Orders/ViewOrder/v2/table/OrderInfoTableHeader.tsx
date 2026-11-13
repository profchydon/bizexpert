import React from "react";
import { X } from "lucide-react";
import { fullBleedBorderBottomSectionClass } from "@/components/application/dividers/fullBleedDividerClasses";
import { Button } from "@/components/ui/button";

interface Props {
  employeeCount: number;
  recipientNoun: string;
  canUpdateSignature?: boolean;
  showMake: boolean;
  showRemove: boolean;
  pendingVerificationCount: number;
  onMakeSignatureRequired?: () => void;
  onRemoveSignatureRequired?: () => void;
  onVerifyAllPending?: () => void;
}

const OrderInfoTableHeader: React.FC<Props> = ({
  employeeCount,
  recipientNoun,
  canUpdateSignature,
  showMake,
  showRemove,
  pendingVerificationCount,
  onMakeSignatureRequired,
  onRemoveSignatureRequired,
  onVerifyAllPending,
}) => (
  <div className={fullBleedBorderBottomSectionClass}>
    <div className="flex min-w-0 items-center justify-between px-6 py-4">
      <div className="flex min-w-0 items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Order information
        </h3>
        {employeeCount > 0 && (
          <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-200">
            {employeeCount} {recipientNoun}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {pendingVerificationCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onVerifyAllPending}
            data-testid="orderinfotableheader-button"
          >
            Verify all pending
          </Button>
        )}
        {canUpdateSignature && showMake && (
          <Button
            variant="primary"
            size="sm"
            onClick={onMakeSignatureRequired}
            data-testid="orderinfotableheader-button-2"
          >
            Make signature required
          </Button>
        )}
        {canUpdateSignature && showRemove && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-error-200 text-error-600 hover:bg-error-50"
            onClick={onRemoveSignatureRequired}
            data-testid="orderinfotableheader-button-3"
          >
            <X className="size-4" />
            Remove signature required
          </Button>
        )}
      </div>
    </div>
  </div>
);

export default OrderInfoTableHeader;
