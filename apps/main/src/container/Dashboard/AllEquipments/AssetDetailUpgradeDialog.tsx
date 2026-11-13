"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import routes from "@/routes";

export function AssetDetailUpgradeDialog({
  open,
  onClose,
  title = "The full asset record is on Manage and above",
  description = "Your asset list stays available. Upgrade to open a device and see its full record.",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}) {
  const { push, isPending } = useTransitionRouter();

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && onClose()}
      data-testid="assetdetailupgradedialog-dialog"
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-testid="assetdetailupgradedialog-button"
          >
            Maybe later
          </Button>
          <Button
            isLoading={isPending}
            onClick={() => push(routes.SETTINGS_SUBSCRIPTION)}
            data-testid="assetdetailupgradedialog-button-2"
          >
            Upgrade to Manage
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
