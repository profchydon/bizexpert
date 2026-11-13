import React, { FC } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignatureRequiredDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const SignatureRequiredDialog: FC<SignatureRequiredDialogProps> = ({
  open,
  onOpenChange,
  onCancel,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md p-6 gap-y-0">
        <div className="flex flex-col mb-4">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-error-50">
            <TriangleAlert
              className="h-7 w-7 text-error-600"
              strokeWidth={1.5}
            />
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="absolute right-4 top-6 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <AlertDialogHeader className="text-center space-y-0">
          <AlertDialogTitle className="text-lg font-semibold text-gray-900">
            Remove Signature Requirement?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600  leading-relaxed pt-1">
            Just a heads up: without signature requirement, your package could
            be left at the doorstep if no one's around to receive it. This means
            less security for your delivery.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-4 justify-center pt-8">
          <AlertDialogCancel
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 h-12 text-gray-700 font-medium border-[1px] border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={onConfirm}
            type="button"
            disabled={isLoading}
            className="flex-1 h-12 bg-error-600 hover:bg-error-700 text-white font-medium rounded-lg border-none disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="signaturerequireddialog-button"
          >
            {isLoading ? "Removing..." : "Remove"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SignatureRequiredDialog;
