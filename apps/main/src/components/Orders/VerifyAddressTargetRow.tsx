import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getInitials } from "@/utils/getInitials";
import { VerificationTarget } from "@/container/Dashboard/Orders/ViewOrder/verificationContexts";

interface Props {
  target: VerificationTarget;
  selectable: boolean;
  checked: boolean;
  onToggle: () => void;
}

const contextLabel: Record<VerificationTarget["context"], string> = {
  pickup: "Pickup",
  delivery: "Delivery",
};

const VerifyAddressTargetRow: React.FC<Props> = ({
  target,
  selectable,
  checked,
  onToggle,
}) => {
  const isVerified = !target.isPending;

  return (
    <label
      className={`flex items-start gap-3 rounded-xl border border-gray-200 p-4 ${
        isVerified ? "opacity-70" : ""
      }`}
      htmlFor={
        selectable
          ? `verify-target-${target.subOrderId}-${target.context}`
          : undefined
      }
    >
      {selectable && (
        <Checkbox
          id={`verify-target-${target.subOrderId}-${target.context}`}
          checked={checked}
          onCheckedChange={onToggle}
          className="mt-1"
          data-testid="verifyaddresstargetrow-checkbox"
        />
      )}
      <Avatar className="h-10 w-10">
        <AvatarFallback className="text-gray-600 bg-gray-100 text-xs">
          {getInitials(target.name) || "NA"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-primary-900">
              {target.name || "N/A"}
            </p>
            {target.hasExplicitContext && (
              <p className="text-xs font-medium text-gray-500">
                {contextLabel[target.context]}
              </p>
            )}
          </div>
          {isVerified ? (
            <Badge variant="success" className="text-[#067647] bg-[#ECFDF3]">
              Verified
            </Badge>
          ) : (
            <Badge variant="pending" className="text-[#B54708] bg-[#FFFAEB]">
              Pending
            </Badge>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-700 break-words">
          {target.address || "Address not available"}
        </p>
      </div>
    </label>
  );
};

export default VerifyAddressTargetRow;
