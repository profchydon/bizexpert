"use client";

import Image from "next/image";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import existingGroup from "@/assets/images/exising-group.png";

interface Props {
  companyName: string;
  domain: string;
  open: boolean;
  isLoading?: boolean;
  onCreateNew: () => void;
  onOpenChange: (open: boolean) => void;
  onRequestToJoin: () => void;
}

const ExistingDomainDialog: React.FC<Props> = ({
  companyName,
  domain,
  open,
  isLoading = false,
  onCreateNew,
  onOpenChange,
  onRequestToJoin,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      data-testid="existingdomaindialog-dialog"
    >
      <DialogContent
        className="max-w-[400px] gap-0 overflow-hidden border-0 p-0 shadow-xlg"
        showCloseButton={false}
      >
        <div className="px-6 pb-8 pt-6 text-center">
          <div className="mx-auto mb-6 w-fit">
            <Image
              src={existingGroup}
              alt=""
              className="h-auto w-[120px]"
              priority
            />
          </div>

          <DialogTitle className="text-center text-lg font-semibold leading-7 text-gray-900">
            Request to join
          </DialogTitle>

          <DialogDescription className="mx-auto mt-1 max-w-[290px] text-sm leading-5 text-gray-600">
            <span className="font-semibold text-gray-900">“{companyName}”</span>{" "}
            already exists for <span className="font-medium">{domain}</span>.
            Would you like to join this company instead?
          </DialogDescription>
        </div>

        <div className="border-t border-gray-200 px-6 pb-6 pt-5">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-gray-300 font-semibold text-gray-700"
              disabled={isLoading}
              onClick={onCreateNew}
              data-testid="existingdomaindialog-button"
            >
              Create new
            </Button>

            <Button
              type="button"
              variant="primary"
              className="flex-1"
              disabled={isLoading}
              onClick={onRequestToJoin}
              data-testid="existingdomaindialog-button-2"
            >
              Request to join
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExistingDomainDialog;
