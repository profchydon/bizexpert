"use client";

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import existingGroup from "@/assets/images/exising-group.png";

export interface JoinRequestItem {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarClassName: string;
}

interface Props {
  open: boolean;
  requests: JoinRequestItem[];
  selectedIds: string[];
  isLoading?: boolean;
  onApprove: () => void;
  onReject: () => void;
  onOpenChange: (open: boolean) => void;
  onToggleRequest: (id: string) => void;
}

const JoinRequestModal: React.FC<Props> = ({
  open,
  requests,
  selectedIds,
  isLoading = false,
  onApprove,
  onReject,
  onOpenChange,
  onToggleRequest,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      data-testid="joinrequestmodal-dialog"
    >
      <DialogContent className="max-w-[400px] gap-0 overflow-hidden border-0 p-0 shadow-xlg">
        <div className="px-6 pt-6">
          <div className="mx-auto w-fit">
            <Image
              src={existingGroup}
              alt=""
              className="h-auto w-[120px]"
              priority
            />
          </div>

          <div className="px-1 pb-5 pt-6 text-center">
            <DialogTitle className="text-center text-lg font-semibold leading-7 text-gray-900">
              Add your team members
            </DialogTitle>

            <DialogDescription className="mx-auto mt-1 max-w-[260px] text-sm leading-5 text-gray-600">
              The following employees have requested to join your workspace
            </DialogDescription>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="space-y-3">
            {requests.map((request) => {
              const isChecked = selectedIds.includes(request.id);

              return (
                <div
                  key={request.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => onToggleRequest(request.id)}
                      disabled={isLoading}
                      className="h-4 w-4 rounded-[4px] border-gray-300 shadow-none data-[state=checked]:bg-primary-600"
                      data-testid="joinrequestmodal-checkbox"
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
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 pb-6 pt-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="destructive"
              className="border-0 bg-error-600 font-semibold text-white hover:bg-error-600/90"
              disabled={selectedIds.length === 0 || isLoading}
              onClick={onReject}
              data-testid="joinrequestmodal-button"
            >
              Reject
            </Button>

            <Button
              type="button"
              variant="primary"
              disabled={selectedIds.length === 0 || isLoading}
              onClick={onApprove}
              data-testid="joinrequestmodal-button-2"
            >
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRequestModal;
