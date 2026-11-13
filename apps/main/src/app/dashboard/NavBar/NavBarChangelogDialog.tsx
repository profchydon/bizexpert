"use client";

import { ChangelogWidgetEmbed } from "@/components/ChangelogWidgetEmbed";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NavBarChangelogDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NavBarChangelogDialog({
  isOpen,
  onOpenChange,
}: Readonly<NavBarChangelogDialogProps>) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
      data-testid="navbarchangelogdialog-dialog"
    >
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[440px] gap-0 p-4 sm:p-6">
        <DialogHeader className="sr-only">
          <DialogTitle>Changelog</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center pt-1">
          <ChangelogWidgetEmbed />
        </div>
      </DialogContent>
    </Dialog>
  );
}
