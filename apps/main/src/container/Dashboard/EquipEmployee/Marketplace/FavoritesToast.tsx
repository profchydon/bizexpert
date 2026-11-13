import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import React, { useEffect } from "react";

interface Props {
  show: boolean;
  action: "added" | "removed";
  onDismiss: () => void;
  onViewFavorites: () => void;
}

const FavoritesToast: React.FC<Props> = ({
  show,
  action,
  onDismiss,
  onViewFavorites,
}) => {
  useEffect(() => {
    if (!show) {
      return;
    }

    const timer = setTimeout(onDismiss, 3000);

    return () => clearTimeout(timer);
  }, [show, onDismiss]);

  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed right-4 top-[88px] z-[103] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-xl border border-primary-300 bg-primary-50 p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
      role="alert"
    >
      <Heart className="mt-0.5 h-5 w-5 shrink-0 fill-primary-600 text-primary-600" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-primary-700">
          {action === "added" ? "Added to favorites" : "Removed from favorites"}
        </p>

        {action === "added" && (
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-primary-700"
            onClick={onViewFavorites}
            data-testid="favoritestoast-button"
          >
            View favorites
          </Button>
        )}
      </div>

      <button
        type="button"
        className="rounded-md p-1 text-primary-700 hover:bg-primary-100"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default FavoritesToast;
