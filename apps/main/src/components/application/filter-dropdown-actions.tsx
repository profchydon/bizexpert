"use client";

import { Button } from "@/components/base/buttons/button";

function FilterDropdownActions({
  applyLabel,
  applyLeadingIcon,
  onApply,
  onReset,
  showReset = true,
  disabled,
}: {
  applyLabel: string;
  applyLeadingIcon?: React.ComponentType<{ className?: string }>;
  onApply: () => void;
  onReset?: () => void;
  showReset?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-t border-secondary pt-4">
      {showReset && (
        <button
          type="button"
          className="text-sm font-semibold text-tertiary transition hover:text-primary"
          onClick={onReset}
        >
          Reset
        </button>
      )}
      <Button
        size="sm"
        color="primary"
        iconLeading={applyLeadingIcon}
        onClick={onApply}
        isDisabled={disabled}
        className={showReset ? "" : "w-full"}
        data-testid="filter-dropdown-actions-button"
      >
        {applyLabel}
      </Button>
    </div>
  );
}

export { FilterDropdownActions };
