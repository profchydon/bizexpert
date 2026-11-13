import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Kit, KitListItem } from "../types";
import KitCard from "./KitCard";

interface Props {
  kits: (Kit | KitListItem)[];
  onEdit: (kit: Kit | KitListItem) => void;
  onArchive: (kit: Kit | KitListItem) => void;
  onDuplicate: (kit: Kit | KitListItem) => void;
  onCreateKit?: () => void;
}

const KitCardView = ({
  kits,
  onEdit,
  onArchive,
  onDuplicate,
  onCreateKit,
}: Props) => {
  if (kits.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-gray-100 p-4 text-gray-500">
          <Plus className="size-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">No kits yet</h2>
          <p className="mt-1 text-sm text-gray-600">
            Kits let you bundle devices into standard packages for your team.
          </p>
        </div>
        <Button
          className="h-10 gap-2 rounded-lg px-3.5 text-sm font-semibold"
          onClick={onCreateKit}
          data-testid="kitcardview-button"
        >
          <Plus className="size-4" /> Create Your First Kit
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {kits.map((kit) => (
        <KitCard
          key={kit.id}
          kit={kit}
          onEdit={onEdit}
          onArchive={onArchive}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
};

export default KitCardView;
