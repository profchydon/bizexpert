import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import React from "react";

interface Props {
  show: boolean;
  count: number;
  onDismiss: () => void;
}

const FavoritesFilterBanner: React.FC<Props> = ({ show, count, onDismiss }) => {
  if (!show) {
    return null;
  }

  let label = "No favorites yet";
  let actionLabel = "Browse all products";

  if (count !== 0) {
    const suffix = count > 1 ? "s" : "";
    label = `Showing ${count} favorite${suffix}`;
    actionLabel = "Show all products";
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border-l-4 border-l-primary-200 bg-primary-50 px-4 py-2.5">
      <Heart className="h-4 w-4 shrink-0 fill-primary-600 text-primary-600" />
      <p className="flex-1 text-sm font-medium text-gray-700">{label}</p>
      <Button
        type="button"
        variant="link"
        className="h-auto p-0 text-primary-700"
        onClick={onDismiss}
        data-testid="favoritesfilterbanner-button"
      >
        {actionLabel}
      </Button>
    </div>
  );
};

export default FavoritesFilterBanner;
