"use client";

import React from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  companyName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequestSentState: React.FC<Props> = ({
  companyName,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      data-testid="requestsentstate-dialog"
    >
      <DialogContent className="max-w-[400px] gap-0 overflow-hidden border-0 p-0 shadow-xlg">
        <div className="px-6 pb-8 pt-6">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500">
                <Send className="h-6 w-6" strokeWidth={2} />
              </div>

              <DialogTitle className="text-[30px] font-semibold leading-[38px] text-[#101828]">
                Request sent
              </DialogTitle>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3 text-sm leading-5">
                <p className="font-medium text-gray-700">
                  {`Your request to join "${companyName}" is pending approval.`}
                </p>

                <DialogDescription className="text-gray-600">
                  You&apos;ll receive an email once the company admin reviews
                  your request.
                </DialogDescription>
              </div>
            </div>

            <p className="text-center text-sm leading-5 text-gray-600">
              Questions?{" "}
              <a
                href="mailto:support@rayda.co"
                className="font-semibold text-[#003999]"
              >
                Contact support@rayda.co
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestSentState;
