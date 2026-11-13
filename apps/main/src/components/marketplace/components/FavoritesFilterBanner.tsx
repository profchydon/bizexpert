"use client";

import { Heart } from "lucide-react";

export interface FavoritesFilterBannerProps {
  show: boolean;
  count: number;
  onDismiss: () => void;
}

export const FavoritesFilterBanner = ({
  show,
  count,
  onDismiss,
}: FavoritesFilterBannerProps) => {
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
    <div className="mp-flex mp-items-center mp-gap-3 mp-rounded-lg mp-border-l-4 mp-border-[var(--mp-primary,#085DE8)] mp-bg-[color-mix(in_srgb,var(--mp-primary,#085DE8)_8%,white)] mp-px-4 mp-py-2.5">
      <Heart className="mp-h-4 mp-w-4 mp-shrink-0 mp-fill-[var(--mp-primary,#085DE8)] mp-text-[var(--mp-primary,#085DE8)]" />
      <p className="mp-flex-1 mp-text-sm mp-font-medium mp-text-gray-700">
        {label}
      </p>
      <button
        type="button"
        className="mp-h-auto mp-p-0 mp-text-sm mp-font-semibold mp-text-[var(--mp-primary,#085DE8)] hover:mp-underline"
        onClick={onDismiss}
        data-testid="favoritesfilterbanner-button"
      >
        {actionLabel}
      </button>
    </div>
  );
};
