import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  children?: React.ReactNode;
  handleContinue: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DeleteAlertDialogWrapper: React.FC<Props> = ({
  children,
  handleContinue,
  open,
  onOpenChange,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    {children ? (
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
    ) : null}
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete
          employee&apos;s account.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className="bg-error-600 border-error-600"
          onClick={handleContinue}
        >
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default DeleteAlertDialogWrapper;
