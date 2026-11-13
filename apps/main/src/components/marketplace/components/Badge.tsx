import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import type { BadgeColor } from "../types";
import { countryCodeToFlagEmoji } from "../utils/countryFlag";

const COLOR_CLASSES: Record<BadgeColor, string> = {
  blue: "mp-bg-blue-50 mp-text-blue-700 mp-ring-blue-200",
  purple: "mp-bg-purple-50 mp-text-purple-700 mp-ring-purple-200",
  gray: "mp-bg-gray-50 mp-text-gray-700 mp-ring-gray-200",
};

export interface BadgeProps {
  color?: BadgeColor;
  className?: string;
  children: ReactNode;
}

export const Badge = ({ color = "gray", className, children }: BadgeProps) => (
  <span
    className={cn(
      "mp-inline-flex mp-items-center mp-gap-1 mp-whitespace-nowrap mp-rounded-full mp-px-2 mp-py-0.5 mp-text-xs mp-font-medium mp-ring-1 mp-ring-inset",
      COLOR_CLASSES[color],
      className,
    )}
  >
    {children}
  </span>
);

export interface CountryBadgeProps {
  code?: string;
  label?: string;
  className?: string;
}

export const CountryBadge = ({ code, label, className }: CountryBadgeProps) => {
  if (!code && !label) {
    return null;
  }

  const flag = countryCodeToFlagEmoji(code);

  return (
    <Badge color="gray" className={className}>
      {flag && <span aria-hidden>{flag}</span>}
      {label}
    </Badge>
  );
};
