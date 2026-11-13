import { CheckCircle2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  editCardOnFileFieldClass,
  editCardOnFileIconWrapClass,
  editCardOnFileStatusClass,
} from "./editSubsidiaryModalClasses";

interface Props {
  cardOnFile: boolean;
  isUpdating?: boolean;
  onUpdate: () => void;
}

export function EditCardOnFileField({
  cardOnFile,
  isUpdating = false,
  onUpdate,
}: Props) {
  return (
    <div className={editCardOnFileFieldClass}>
      <div className={editCardOnFileIconWrapClass}>
        <CreditCard className="size-5 text-primary-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900">Card on file</p>
        {cardOnFile ? (
          <p className={editCardOnFileStatusClass}>
            <CheckCircle2 className="size-4 shrink-0" />A card is saved for this
            entity.
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            No card captured. Add one so this entity can bill.
          </p>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        isLoading={isUpdating}
        disabled={isUpdating}
        onClick={onUpdate}
        data-testid="editcardonfilefield-button"
      >
        {cardOnFile ? "Replace card" : "Add card"}
      </Button>
    </div>
  );
}
