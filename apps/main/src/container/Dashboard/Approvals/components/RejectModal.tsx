"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function RejectApprovalModal({
  employeeName,
  onClose,
  onConfirm,
  open,
  saving = false,
}: {
  employeeName?: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  open: boolean;
  saving?: boolean;
}) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const trimmed = reason.trim();
  const valid = trimmed.length >= 5;

  useEffect(() => {
    if (!open) return;
    setReason("");
    setTouched(false);
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => (!next ? onClose() : null)}
      data-testid="rejectmodal-dialog"
    >
      <DialogContent
        overlayClassName="z-[1005] bg-[#101828]/60 backdrop-blur-[4px]"
        className="z-[1006] max-w-md rounded-xl p-6"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-50 text-error-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle className="text-base font-semibold text-gray-900">
              Reject this approval?
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-500">
              Storage reserves will be released and any pending RFQs cancelled
              {employeeName ? ` for ${employeeName}` : ""}.
            </DialogDescription>
          </div>
        </div>
        <label className="mt-5 flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-700">
            Reason for rejection
          </span>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Share at least a sentence so the requester understands the decision."
            rows={4}
          />
          <span
            className={touched && !valid ? "text-error-600" : "text-gray-500"}
          >
            {touched && !valid
              ? "Please provide at least 5 characters."
              : `${trimmed.length} characters`}
          </span>
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            variant="outline"
            disabled={saving}
            className="text-sm"
            onClick={onClose}
            data-testid="rejectmodal-button"
          >
            Cancel
          </Button>
          <Button
            disabled={saving}
            className="text-sm"
            onClick={() => {
              if (!valid) {
                setTouched(true);
                return;
              }
              onConfirm(trimmed);
            }}
            data-testid="rejectmodal-button-2"
          >
            Confirm rejection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
