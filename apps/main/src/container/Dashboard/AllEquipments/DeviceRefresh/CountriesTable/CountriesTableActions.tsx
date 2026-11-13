import { Button } from "@/components/ui/button";
import { memo } from "react";

const CountriesTableActions: React.FC<{
  onView: () => void;
  isLoading?: boolean;
}> = memo(({ onView, isLoading = false }) => {
  return (
    <div className="grid place-content-end">
      <Button
        className="text-primary-700 font-semibold w-auto text-[12px]"
        variant="ghost"
        size="sm"
        onClick={onView}
        isLoading={isLoading}
        data-testid="countriestableactions-button"
      >
        View
      </Button>
    </div>
  );
});

export default CountriesTableActions;
