import { Checkbox } from "@/components/base/checkbox/checkbox";
import { cn } from "@/lib/utils";
import { flagByCode } from "./flagByCode";

interface CartCountryHeaderProps {
  countryCode: string;
  countryLabel: string;
  itemCount: number;
  className?: string;
  showSelectAll?: boolean;
  isSelectAllChecked?: boolean;
  isSelectAllIndeterminate?: boolean;
  isSelectAllDisabled?: boolean;
  onToggleSelectAll?: () => void;
}

function CartCountryHeader({
  countryCode,
  countryLabel,
  itemCount,
  className,
  showSelectAll = false,
  isSelectAllChecked = false,
  isSelectAllIndeterminate = false,
  isSelectAllDisabled = false,
  onToggleSelectAll,
}: Readonly<CartCountryHeaderProps>) {
  const Flag = flagByCode(countryCode);

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg bg-tertiary px-3 py-2.5",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {Flag ? (
          <span role="img" aria-label={`${countryLabel} flag`}>
            <Flag className="size-5 rounded-full" />
          </span>
        ) : null}
        <span className="text-sm font-semibold text-primary">
          {countryLabel}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {showSelectAll && (
          <Checkbox
            size="sm"
            label="Select all"
            isSelected={isSelectAllChecked}
            isIndeterminate={isSelectAllIndeterminate}
            isDisabled={isSelectAllDisabled}
            onChange={() => onToggleSelectAll?.()}
            aria-label={`Select all items in ${countryLabel}`}
            data-testid="cartcountryheader-checkbox"
          />
        )}

        <span className="text-sm text-tertiary">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>
    </div>
  );
}

export { CartCountryHeader };
export default CartCountryHeader;
