import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const BREAKDOWN_ITEMS = [
  "Access to company systems and resources will be revoked.",
  'Status will be updated from "Active" to "Archived".',
  "Access to dashboards will be revoked.",
  "Any pending requests will be canceled.",
];

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  excludedCount?: number;
  onContinue: () => void;
  isContinueLoading?: boolean;
}

const OffboardConfirmModal: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  count,
  excludedCount = 0,
  onContinue,
  isContinueLoading = false,
}) => {
  const noun = count === 1 ? "employee" : "employees";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
      data-testid="offboardconfirmmodal-dialog"
    >
      <DialogContent showCloseButton={false} className="max-w-[480px]">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-warning-50 ring-8 ring-warning-100">
          <AlertTriangle className="h-5 w-5 text-warning-600" />
        </div>
        <DialogTitle className="mt-4 text-lg font-semibold text-gray-900">
          Off-board {count} {noun}?
        </DialogTitle>
        <DialogDescription className="mt-1 text-sm text-gray-600">
          Here&apos;s what off-boarding{" "}
          {count === 1 ? "this employee" : "these employees"} typically entails:
        </DialogDescription>
        <ul className="mt-4 flex flex-col gap-3">
          {BREAKDOWN_ITEMS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm text-gray-700"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-gray-500">
          You&apos;ll decide what happens to each device on the next screen.
        </p>
        {excludedCount > 0 && (
          <p className="mt-3 rounded-lg bg-warning-50 px-3 py-2 text-xs text-warning-700">
            {excludedCount} selected{" "}
            {excludedCount === 1 ? "employee has" : "employees have"} no
            assigned devices and won&apos;t be off-boarded.
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 px-4 text-sm font-semibold text-gray-700"
            onClick={() => onOpenChange(false)}
            data-testid="offboardconfirmmodal-button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            className="h-11 px-4 text-sm font-semibold"
            onClick={onContinue}
            isLoading={isContinueLoading}
            data-testid="offboardconfirmmodal-button-2"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OffboardConfirmModal;
