import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import React from "react";
import { user_minus_orange_icon } from "@/assets/icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  isRevokeButtonDisabled: boolean;
}

const DeleteInvitationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onDelete,
  isRevokeButtonDisabled,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      data-testid="deleteinvitationmodal-dialog"
    >
      <DialogContent className="overflow-y-auto">
        <div className="space-y-4 grid place-content-center mb-2">
          <div>
            <div className="grid place-content-center mb-4">
              <Image
                className="grid place-content-center"
                src={user_minus_orange_icon}
                alt="user-icon"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-lg text-center">
              Delete Admin Invitation
            </h3>
            <span className="text-sm text-center block">
              Deleting this invitation will only revokes admin rights for this
              user. If the user exist as an employee, they remain in the system
              as an employee with a non-admin role.
            </span>
          </div>
        </div>
        <div className="flex gap-x-4 border-t-2 ">
          <Button
            className="w-full mt-4"
            onClick={onDelete}
            disabled={isRevokeButtonDisabled}
            data-testid="deleteinvitationmodal-button"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInvitationModal;
