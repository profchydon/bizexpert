import { Trash2 } from "lucide-react";
import { cn } from "../../utils/cn";
import { PrimaryButton, IconButton } from "../PrimaryButton";

export function FilterPanelFooter({
  isMobile,
  isApplyFilterLoading,
  onApplyFilter,
  resetFilter,
}: {
  isMobile?: boolean;
  isApplyFilterLoading?: boolean;
  onApplyFilter: () => void | Promise<void>;
  resetFilter: () => void | Promise<void>;
}) {
  return (
    <div
      className={cn(
        "mp-flex mp-shrink-0 mp-items-center mp-gap-4 mp-border-t mp-border-gray-200 mp-bg-white mp-pt-4",
        isMobile ? "mp-mt-4" : "mp-mt-3",
      )}
    >
      <PrimaryButton
        size="lg"
        className="mp-flex-1"
        onClick={onApplyFilter}
        data-testid="marketplace-apply-filter-button"
      >
        {isApplyFilterLoading ? "Applying..." : "Apply Filter"}
      </PrimaryButton>
      <IconButton
        className="mp-h-12 mp-w-12"
        onClick={resetFilter}
        aria-label="Reset filters"
      >
        <Trash2 className="mp-h-5 mp-w-5 mp-text-gray-700" />
      </IconButton>
    </div>
  );
}
