import React from "react";
import { Button } from "../ui/button";

interface Props {
  onClose: () => void;
  onSubmit?: () => void;
  isSubmitLoading?: boolean;
  disableSubmitButton?: boolean;
  disableCancelButton?: boolean;
  submitButtonType?: "submit" | "reset" | "button";
  cancelText?: string;
  saveText?: string;
}
const DrawerFooter: React.FC<Props> = ({
  onClose,
  onSubmit,
  isSubmitLoading,
  cancelText = "Cancel",
  saveText = "Submit",
  submitButtonType = "button",
  disableSubmitButton = false,
  disableCancelButton = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border-secondary bg-white px-6 py-4 ">
      <div className="grid place-content-end my-auto h-full w-full">
        <div className="flex gap-x-6 ">
          <Button
            className="text-sm font-semibold"
            onClick={onClose}
            variant="outline"
            type="button"
            disabled={disableCancelButton}
            data-testid="drawerfooter-button"
          >
            {cancelText}
          </Button>
          <Button
            className="text-sm font-semibold"
            disabled={isSubmitLoading || disableSubmitButton}
            onClick={onSubmit}
            type={submitButtonType}
            data-testid="drawerfooter-button-2"
          >
            {saveText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DrawerFooter;
