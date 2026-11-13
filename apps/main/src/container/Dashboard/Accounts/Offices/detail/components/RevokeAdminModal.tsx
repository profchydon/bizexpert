import { UserX, X } from "lucide-react";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  editSubsidiaryFooterClass,
  editSubsidiaryModalCloseButtonClass,
  editSubsidiaryModalContentClass,
  editSubsidiaryModalDescriptionClass,
  editSubsidiaryModalHeaderClass,
  editSubsidiaryModalTitleClass,
} from "../../../components/editSubsidiaryModalClasses";
import {
  officeModalCancelButtonClass,
  officeModalFooterButtonClass,
} from "./officeModalFieldClasses";

interface Props {
  name: string | null;
  officeName: string;
  isOpen: boolean;
  isConfirming?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RevokeAdminModal({
  name,
  officeName,
  isOpen,
  isConfirming = false,
  onClose,
  onConfirm,
}: Props) {
  const who = name ?? "This person";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      data-testid="revokeadminmodal-dialog"
    >
      <DialogContent
        className={editSubsidiaryModalContentClass}
        showCloseButton={false}
      >
        <div className={editSubsidiaryModalHeaderClass}>
          <FeaturedIcon icon={UserX} color="error" size="md" />
          <button
            type="button"
            className={editSubsidiaryModalCloseButtonClass}
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <DialogTitle className={editSubsidiaryModalTitleClass}>
          Revoke admin access?
        </DialogTitle>
        <p className={editSubsidiaryModalDescriptionClass}>
          {who} will no longer be an admin of {officeName}. They lose their
          admin access to it.
        </p>
        <div className={editSubsidiaryFooterClass}>
          <Button
            variant="outline"
            className={officeModalCancelButtonClass}
            onClick={onClose}
            data-testid="revokeadminmodal-button"
          >
            Cancel
          </Button>
          <Button
            className={`${officeModalFooterButtonClass} bg-error-600 text-white hover:bg-error-700`}
            isLoading={isConfirming}
            onClick={onConfirm}
            data-testid="revokeadminmodal-button-2"
          >
            Revoke access
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
