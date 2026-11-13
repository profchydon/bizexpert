import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  count: number;
  isDeleting: boolean;
  onDelete: () => void;
  onClear: () => void;
};

export function ProductsBulkBar({
  count,
  isDeleting,
  onDelete,
  onClear,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-100 bg-primary-50 px-5 py-2.5">
      <span className="text-sm font-semibold text-gray-900">
        {count} selected
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          isLoading={isDeleting}
          onClick={onDelete}
        >
          <Trash2 className="mr-2 size-4" />
          Delete products
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={isDeleting}
        >
          <X className="mr-2 size-4" />
          Clear
        </Button>
      </div>
    </div>
  );
}
