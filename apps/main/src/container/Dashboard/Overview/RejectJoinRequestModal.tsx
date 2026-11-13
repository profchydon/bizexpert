"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { JoinRequestItem } from "./JoinRequestModal";

interface Props {
  open: boolean;
  rejectedRequests: JoinRequestItem[];
  isLoading?: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  onRejectRequests: () => void;
}

const RejectJoinRequestModal: React.FC<Props> = ({
  open,
  rejectedRequests,
  isLoading = false,
  onClose,
  onOpenChange,
  onRejectRequests,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      data-testid="rejectjoinrequestmodal-dialog"
    >
      <DialogContent
        className="max-w-[400px] gap-0 overflow-hidden border-0 p-0 shadow-xlg"
        showCloseButton={false}
      >
        <div className="px-6 pt-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning-100">
            <AlertTriangle className="h-5 w-5 text-warning-600" />
          </div>

          <div className="px-1 pb-5 pt-4 text-center">
            <DialogTitle className="text-center text-lg font-semibold leading-7 text-gray-900">
              Reject unchecked members
            </DialogTitle>

            <DialogDescription className="mx-auto mt-1 max-w-[260px] text-sm leading-5 text-gray-600">
              You unchecked these members, which means their access requests
              will be rejected:
            </DialogDescription>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="space-y-3">
            {rejectedRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Checkbox
                    checked
                    disabled
                    className="h-4 w-4 rounded-[4px] border-gray-300 shadow-none data-[state=checked]:bg-primary-600 data-[state=checked]:opacity-100"
                    data-testid="rejectjoinrequestmodal-checkbox"
                  />

                  <div className="flex min-w-0 items-center gap-2">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-gray-500 ${request.avatarClassName}`}
                    >
                      {request.initials}
                    </div>

                    <p className="truncate text-sm font-semibold text-gray-900">
                      {request.name}
                    </p>
                  </div>
                </div>

                <p className="truncate text-xs font-medium text-gray-600">
                  {request.email}
                </p>
              </div>
            ))}

            <p className="pt-1 text-xs leading-[18px] text-gray-600">
              These users will be notified that their requests were not
              approved.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 pb-6 pt-5">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-gray-300 font-semibold text-gray-700"
              disabled={isLoading}
              onClick={onClose}
              data-testid="rejectjoinrequestmodal-button"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              className="flex-1 border-0 bg-error-600 font-semibold text-white hover:bg-error-600/90"
              disabled={isLoading}
              onClick={onRejectRequests}
              data-testid="rejectjoinrequestmodal-button-2"
            >
              Reject requests
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RejectJoinRequestModal;
