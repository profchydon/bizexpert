import React, { FC, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import SignatureRequiredDialog from "./SignatureRequiredDialog";
import { BadgeInfo } from "lucide-react";

interface Props {
  isSignatureRequired: boolean;
  setIsSignatureRequired: (value: boolean) => void;
  isAutoEnabled?: boolean;
  orderTotal?: number;
}

const SignatureRequiredToggle: FC<Props> = ({
  isSignatureRequired,
  setIsSignatureRequired,
  isAutoEnabled = false,
  orderTotal,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleToggleTurnOn = () => {
    setIsSignatureRequired(true);
  };

  const handleToggleTurnOff = () => {
    setShowConfirmation(true);
  };

  const handleToggle = (checked: boolean) => {
    if (checked) {
      handleToggleTurnOn();
    } else {
      handleToggleTurnOff();
    }
  };

  const handleConfirmTurnOff = () => {
    setIsSignatureRequired(false);
    setShowConfirmation(false);
  };

  const handleCancelTurnOff = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="border-[1px] border-gray-200 bg-white p-4 rounded-lg space-y-3">
          <div className="flex items-start space-x-4">
            <Switch
              id="signature-required"
              checked={isSignatureRequired}
              onCheckedChange={handleToggle}
              className="mt-1"
              data-testid="signature-required-toggle"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="signature-required"
                  className="text-base font-medium text-gray-700 cursor-pointer"
                >
                  Signature Required
                </Label>
              </div>
              <p
                className={`text-sm leading-relaxed mt-1 ${
                  isSignatureRequired ? "text-gray-600" : "text-error-600"
                }`}
              >
                {isSignatureRequired
                  ? "Delivery will be attempted only when employee is available to receive. However, this will not always be guaranteed"
                  : "Package may be left unattended if no one is available to receive it."}
              </p>
            </div>
          </div>
        </div>

        {isSignatureRequired && (
          <div className="border-[1px] border-primary-200 bg-primary-25 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <BadgeInfo className="h-5 w-5 text-primary-700 mt-[2px]" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-primary-900">
                  {isAutoEnabled
                    ? "Signature requirement automatically enabled"
                    : "Signature requirement enabled"}
                </p>
                {isAutoEnabled && (
                  <p className="text-sm text-primary-700">
                    (order value exceeds $2,500)
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <SignatureRequiredDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onCancel={handleCancelTurnOff}
        onConfirm={handleConfirmTurnOff}
      />
    </>
  );
};

export default SignatureRequiredToggle;
