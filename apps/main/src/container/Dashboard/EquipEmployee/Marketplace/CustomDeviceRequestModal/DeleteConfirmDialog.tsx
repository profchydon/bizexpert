import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function DeleteConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  skipConfirm,
  onSkipConfirmChange,
}: Readonly<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  skipConfirm: boolean;
  onSkipConfirmChange: (value: boolean) => void;
}>) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onCancel()}
      data-testid="deleteconfirmdialog-dialog"
    >
      <DialogContent className="max-w-[400px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete device?</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this device entry? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-1 flex items-center gap-3">
          <Checkbox
            checked={skipConfirm}
            onCheckedChange={(checked) => onSkipConfirmChange(Boolean(checked))}
            data-testid="deleteconfirmdialog-checkbox"
          />
          <span className="text-sm text-gray-700">Don&apos;t ask again</span>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="md"
            onClick={onCancel}
            data-testid="deleteconfirmdialog-button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="md"
            onClick={onConfirm}
            data-testid="deleteconfirmdialog-button-2"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteConfirmDialog };
