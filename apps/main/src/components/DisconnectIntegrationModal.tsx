import React, { useLayoutEffect, useState } from "react";
import { Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import {
  CONTAINED_SLIDEOUT_CONTENT_CLASS,
  CONTAINED_SLIDEOUT_OVERLAY_CLASS,
  getSlideoutDialogElement,
} from "@/utils/drawerOverlayStacking";
import { cn } from "@/lib/utils";

interface DisconnectIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  integrationName: string;
  isLoading?: boolean;
  className?: string;
  elevateOverDrawer?: boolean;
}

const DisconnectIntegrationModal: React.FC<DisconnectIntegrationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  integrationName,
  isLoading = false,
  className = "",
  elevateOverDrawer = false,
}) => {
  const [portalContainer, setPortalContainer] = useState<
    HTMLElement | undefined
  >();

  useLayoutEffect(() => {
    if (!elevateOverDrawer || !isOpen) {
      setPortalContainer(undefined);
      return;
    }
    setPortalContainer(getSlideoutDialogElement());
  }, [elevateOverDrawer, isOpen]);

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <AlertDialogContent
        container={portalContainer}
        className={cn(
          "max-w-[400px] p-6",
          className,
          elevateOverDrawer && CONTAINED_SLIDEOUT_CONTENT_CLASS,
        )}
        overlayClassName={
          elevateOverDrawer ? CONTAINED_SLIDEOUT_OVERLAY_CLASS : undefined
        }
      >
        <div className="flex flex-col items-center">
          {/* Icon */}
          <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-error-100">
            <Unlink className="h-5 w-5 text-error-600" strokeWidth={2} />
          </div>

          {/* Header */}
          <div className="flex flex-col items-center gap-1 text-center mt-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Disconnect {integrationName}?
            </h2>
            <p className="text-base text-gray-600">
              Rayda will stop syncing employee data from {integrationName}.
              Existing employee records will not be deleted.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex w-full gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 text-base font-semibold text-gray-700 border-gray-300 hover:bg-gray-50"
              data-testid="disconnectintegrationmodal-button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 h-12 text-base font-semibold bg-error-600 hover:bg-error-700 text-white border-0"
              data-testid="disconnectintegrationmodal-button-2"
            >
              {isLoading ? "Disconnecting..." : "Disconnect"}
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DisconnectIntegrationModal;
