import React from "react";
import { X } from "lucide-react";
import FilterActions, { FilterActionsProps } from "./FilterActions";

interface Props extends FilterActionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileFilterDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  onApplyFilter,
  resetFilter,
  ...filterProps
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close filter overlay"
      />

      <div className="absolute inset-y-0 left-0 flex w-full max-w-[340px] flex-col bg-gray-25">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            type="button"
            className="rounded-md p-1 text-gray-500 transition hover:text-gray-900"
            onClick={onClose}
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0 p-4">
          <FilterActions
            {...filterProps}
            isMobile
            onApplyFilter={onApplyFilter}
            resetFilter={resetFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileFilterDrawer;
