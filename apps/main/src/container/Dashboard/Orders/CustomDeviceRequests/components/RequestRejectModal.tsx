import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { XCircle } from "lucide-react";

interface RequestRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isSubmitting?: boolean;
  otherReason: string;
  requestId: string;
  setOtherReason: (value: string) => void;
}

export default function RequestRejectModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  otherReason,
  requestId,
  setOtherReason,
}: Readonly<RequestRejectModalProps>) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          onClose();
        }
      }}
      data-testid="requestrejectmodal-dialog"
    >
      <DialogContent
        className="z-[1012] max-w-md"
        overlayClassName="z-[1011]"
        showCloseButton={!isSubmitting}
        onPointerDownOutside={(event) => {
          if (isSubmitting) {
            event.preventDefault();
          }
        }}
        onEscapeKeyDown={(event) => {
          if (isSubmitting) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <div className="flex items-start gap-4">
            <FeaturedIcon
              icon={XCircle}
              color="error"
              theme="light"
              size="lg"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-primary">
                Reject quote?
              </h3>
              <p className="text-sm text-tertiary">
                You’re about to reject quote {requestId}. Add an optional note
                for your records.
              </p>
            </div>
          </div>
        </DialogHeader>

        <Textarea
          value={otherReason}
          onChange={(event) => setOtherReason(event.target.value)}
          rows={3}
          placeholder="Optional rejection note"
          disabled={isSubmitting}
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            data-testid="requestrejectmodal-button"
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={onConfirm}
            disabled={isSubmitting}
            data-testid="requestrejectmodal-button-2"
          >
            {isSubmitting ? "Rejecting..." : "Reject Quote"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
