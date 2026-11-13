import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";
import ShareIcon from "@/assets/images/feature.svg";
import { IEmployees } from "@/types/employees";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInvite: () => void;
  isButtonDisabled: boolean;
  employee: IEmployees;
}

const InvitationEmployeeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onInvite,
  isButtonDisabled,
  employee,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      data-testid="invitationemployeemodal-dialog"
    >
      <DialogContent className="overflow-y-auto">
        <div className="space-y-4 grid place-content-center mb-2">
          <div>
            <div className="grid place-content-center mb-4">
              <Image
                className="grid place-content-center"
                src={ShareIcon}
                alt="share-icon"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-lg text-center">
              Share Invite
            </h3>
            <span className="text-sm text-center block">
              Are you sure you invite{" "}
              <span className="font-bold text-gray-900">
                {employee?.first_name} {employee?.last_name}?
              </span>
            </span>
          </div>
        </div>
        <div className="flex gap-x-4 border-t-1 ">
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={onClose}
            disabled={isButtonDisabled}
            data-testid="invitationemployeemodal-button"
          >
            Cancel
          </Button>
          <Button
            className="w-full mt-4"
            onClick={onInvite}
            disabled={isButtonDisabled}
            data-testid="invitationemployeemodal-button-2"
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationEmployeeModal;
