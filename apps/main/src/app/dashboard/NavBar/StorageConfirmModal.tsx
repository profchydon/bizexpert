import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FeaturedIcon } from "@/components/FeaturedIcon";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StorageConfirmModalProps {
  isOpen: boolean;
  itemCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirmLoading?: boolean;
}

const StorageConfirmModal: React.FC<StorageConfirmModalProps> = ({
  isOpen,
  itemCount,
  onConfirm,
  onCancel,
  isConfirmLoading = false,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="max-w-md rounded-xl">
        <AlertDialogHeader>
          <FeaturedIcon icon={Package} size="lg" color="brand" />
          <AlertDialogTitle>Send all to storage?</AlertDialogTitle>
          <AlertDialogDescription>
            All {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            will be sent to storage. You can assign them to employees later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            onClick={onConfirm}
            isLoading={isConfirmLoading}
            data-testid="storageconfirmmodal-button"
          >
            Yes, send to storage
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StorageConfirmModal;
