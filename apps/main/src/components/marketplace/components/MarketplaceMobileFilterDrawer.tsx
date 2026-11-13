import type { ReactNode } from "react";
import { Filter, X } from "lucide-react";
import { IconButton } from "./PrimaryButton";

export interface MarketplaceMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const MarketplaceMobileFilterDrawer = ({
  isOpen,
  onClose,
  children,
}: MarketplaceMobileFilterDrawerProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="mp-fixed mp-inset-0 mp-z-50 lg:mp-hidden">
      <button
        type="button"
        className="mp-absolute mp-inset-0 mp-bg-black/50"
        onClick={onClose}
        aria-label="Close filter overlay"
      />

      <div className="mp-root mp-absolute mp-inset-y-0 mp-left-0 mp-flex mp-w-full mp-max-w-[340px] mp-flex-col mp-bg-gray-50">
        <div className="mp-flex mp-items-center mp-justify-between mp-border-b mp-border-gray-200 mp-px-4 mp-py-4">
          <h2 className="mp-text-lg mp-font-semibold mp-text-gray-900">
            Filters
          </h2>
          <button
            type="button"
            className="mp-rounded-md mp-p-1 mp-text-gray-500 mp-transition hover:mp-text-gray-900"
            onClick={onClose}
            aria-label="Close filters"
          >
            <X className="mp-h-5 mp-w-5" />
          </button>
        </div>

        <div className="mp-flex mp-min-h-0 mp-flex-1 mp-flex-col mp-p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export interface MarketplaceMobileFilterTriggerProps {
  onOpen: () => void;
}

export const MarketplaceMobileFilterTrigger = ({
  onOpen,
}: MarketplaceMobileFilterTriggerProps) => (
  <div className="mp-mb-4 lg:mp-hidden">
    <IconButton
      className="mp-h-11 mp-w-full mp-gap-2 mp-rounded-lg mp-px-4 mp-text-sm mp-font-semibold"
      onClick={onOpen}
      data-testid="marketplace-mobile-filter-button"
    >
      <Filter className="mp-h-4 mp-w-4" />
      Filters
    </IconButton>
  </div>
);
