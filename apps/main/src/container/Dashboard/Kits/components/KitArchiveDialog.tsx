"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Kit, KitListItem } from "../types";

interface Props {
  kit: Kit | KitListItem | null;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const KitArchiveDialog = ({ kit, isLoading, onCancel, onConfirm }: Props) => {
  const archived = kit?.is_archived;
  const title = archived ? "Unarchive Kit" : "Archive Kit";
  const action = archived ? "Unarchive Kit" : "Archive Kit";

  return (
    <Dialog
      open={Boolean(kit)}
      onOpenChange={(open) => !open && onCancel()}
      data-testid="kitarchivedialog-dialog"
    >
      <DialogContent className="max-w-md gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {kit && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warning-100">
                <AlertCircle className="size-5 text-warning-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {archived ? "Unarchive Kit?" : "Archive Kit?"}
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Are you sure you want to {archived ? "unarchive" : "archive"}{" "}
                  <strong>{kit.name ?? "this kit"}</strong>?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isLoading}
                data-testid="kitarchivedialog-button"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onConfirm}
                disabled={isLoading}
                data-testid="kitarchivedialog-button-2"
              >
                {isLoading ? "Working..." : action}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default KitArchiveDialog;
