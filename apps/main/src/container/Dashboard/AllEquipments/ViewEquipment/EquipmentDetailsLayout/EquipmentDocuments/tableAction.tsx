import { Button } from "@/components/ui/button";

const EquipmentDocumentsAction: React.FC<{
  item?: Record<string, string>;
  onDownload: () => void;
  onDelete: () => void;
  isLoading: boolean;
}> = ({ onDownload, onDelete, isLoading }) => {
  return (
    <div className="flex flex-row gap-2 w-[20ch] justify-self-end">
      <Button
        className="text-sm font-semibold disabled:cursor-not-allowed"
        variant="ghost"
        size="sm"
        onClick={onDelete}
        disabled={isLoading}
        data-testid="equipmentdocumentsaction-button"
      >
        Delete
      </Button>
      <Button
        className="text-primary-700 font-semibold"
        variant="ghost"
        size="sm"
        onClick={onDownload}
        data-testid="equipmentdocumentsaction-button-2"
      >
        Download
      </Button>
    </div>
  );
};

export default EquipmentDocumentsAction;
