"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import type { EmployeeSelection } from "../../types";

export function RequestChangesModal({
  selection,
  open,
  onCancel,
  onSubmit,
}: {
  selection: EmployeeSelection | null;
  open: boolean;
  onCancel: () => void;
  onSubmit: (id: string, notes: string) => void;
}) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) setNotes(selection?.changeRequestNotes ?? "");
  }, [open, selection]);

  if (!selection) return null;

  const canSend = notes.trim().length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onCancel()}
      data-testid="requestchangesmodal-dialog"
    >
      <DialogContent
        overlayClassName="z-[1022] bg-[#101828]/70 backdrop-blur-sm"
        showCloseButton={false}
        className="z-[1023] max-w-md gap-0 rounded-xl border-gray-200 p-6"
      >
        <div className="flex flex-col gap-5">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            <MessageDotsCircleIcon className="size-6" />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium text-gray-900">
              Request changes
            </h3>
            <p className="text-sm font-normal leading-6 text-gray-600">
              Send {selection.employeeName} a note explaining what to update.
              Their selection will move to{" "}
              <span className="font-medium text-gray-700">
                Changes requested
              </span>{" "}
              until they resubmit.
            </p>
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            Note to employee
            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="e.g. Please pick a single monitor — dual monitors aren't covered for your role this cycle."
              rows={5}
              className="min-h-36 resize-none rounded-lg border-gray-300 text-sm font-normal leading-6 text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-lg text-sm font-medium text-gray-700"
              onClick={onCancel}
              data-testid="requestchangesmodal-button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!canSend}
              className="h-11 rounded-lg text-sm font-medium"
              onClick={() => onSubmit(selection.id, notes.trim())}
              data-testid="requestchangesmodal-button-2"
            >
              Send to employee
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MessageDotsCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7.5 12h.01M12 12h.01M16.5 12h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12c0 4.9706-4.0294 9-9 9-1.5914 0-3.0862-.4131-4.3828-1.1376-.2491-.1392-.3737-.2088-.4914-.2399-.1173-.031-.2005-.0363-.3215-.0295-.1214.0068-.2573.0521-.529.1427l-2.8232.9411c-.4997.1666-.7495.2499-.9156.1906-.1449-.0517-.2589-.1657-.3106-.3106-.0593-.1661.024-.4159.1906-.9156l.9411-2.8232c.0906-.2717.1359-.4076.1427-.529.0068-.121-.0015-.2042-.0325-.3215-.0311-.1177-.1007-.2423-.2399-.4914C2.4131 15.0862 2 13.5914 2 12c0-4.9706 4.0294-9 9-9s10 4.0294 10 9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
