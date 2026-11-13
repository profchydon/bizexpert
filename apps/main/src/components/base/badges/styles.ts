import { badgeTypes } from "./badge-types";
import type {
  BadgeColors,
  BadgeTypeToColorMap,
  BadgeTypes,
} from "./badge-types";

export const filledColors: Record<
  BadgeColors,
  { root: string; addon: string; addonButton: string }
> = {
  gray: {
    root: "bg-gray-100 text-gray-700 ring-gray-200",
    addon: "text-gray-500",
    addonButton: "hover:bg-gray-200 text-gray-500 hover:text-gray-700",
  },
  brand: {
    root: "bg-primary-50 text-primary-700 ring-primary-200",
    addon: "text-primary-500",
    addonButton: "hover:bg-primary-100 text-primary-400 hover:text-primary-600",
  },
  error: {
    root: "bg-error-50 text-error-700 ring-error-200",
    addon: "text-error-500",
    addonButton: "hover:bg-error-100 text-error-400 hover:text-error-600",
  },
  warning: {
    root: "bg-warning-50 text-warning-700 ring-warning-200",
    addon: "text-warning-500",
    addonButton: "hover:bg-warning-100 text-warning-500 hover:text-warning-700",
  },
  success: {
    root: "bg-success-50 text-success-700 ring-success-200",
    addon: "text-success-500",
    addonButton: "hover:bg-success-100 text-success-400 hover:text-success-600",
  },
  "gray-blue": {
    root: "bg-gray-100 text-gray-700 ring-gray-200",
    addon: "text-gray-500",
    addonButton: "hover:bg-gray-200 text-gray-500 hover:text-gray-700",
  },
  "blue-light": {
    root: "bg-primary-50 text-primary-700 ring-primary-200",
    addon: "text-primary-500",
    addonButton: "hover:bg-primary-100 text-primary-400 hover:text-primary-600",
  },
  blue: {
    root: "bg-primary-50 text-primary-700 ring-primary-200",
    addon: "text-primary-500",
    addonButton: "hover:bg-primary-100 text-primary-400 hover:text-primary-600",
  },
  indigo: {
    root: "bg-primary-50 text-primary-700 ring-primary-200",
    addon: "text-primary-500",
    addonButton: "hover:bg-primary-100 text-primary-400 hover:text-primary-600",
  },
  purple: {
    root: "bg-purple-50 text-purple-700 ring-purple-700/20",
    addon: "text-purple-700",
    addonButton:
      "hover:bg-purple-50/80 text-purple-700/70 hover:text-purple-700",
  },
  pink: {
    root: "bg-secondary-50 text-secondary-700 ring-secondary-200",
    addon: "text-secondary-600",
    addonButton:
      "hover:bg-secondary-100 text-secondary-500 hover:text-secondary-700",
  },
  orange: {
    root: "bg-secondary-50 text-secondary-700 ring-secondary-200",
    addon: "text-secondary-600",
    addonButton:
      "hover:bg-secondary-100 text-secondary-500 hover:text-secondary-700",
  },
};

const addonOnlyColors = Object.fromEntries(
  Object.entries(filledColors).map(([key, value]) => [
    key,
    { root: "", addon: value.addon },
  ]),
) as Record<BadgeColors, { root: string; addon: string }>;

export const withPillTypes = {
  [badgeTypes.pillColor]: {
    common:
      "inline-flex size-max items-center whitespace-nowrap rounded-full ring-1 ring-inset",
    styles: filledColors,
  },
  [badgeTypes.badgeColor]: {
    common:
      "inline-flex size-max items-center whitespace-nowrap rounded-md ring-1 ring-inset",
    styles: filledColors,
  },
  [badgeTypes.badgeModern]: {
    common:
      "inline-flex size-max items-center whitespace-nowrap rounded-md ring-1 ring-inset shadow-xs",
    styles: {
      gray: {
        root: "bg-white text-gray-700 ring-gray-200",
        addon: "text-gray-500",
        addonButton: "hover:bg-gray-100 text-gray-500 hover:text-gray-700",
      },
    },
  },
} satisfies Record<
  BadgeTypes,
  {
    common: string;
    styles: Record<
      string,
      { root: string; addon: string; addonButton?: string }
    >;
  }
>;

export const withBadgeTypes = {
  [badgeTypes.pillColor]: {
    common:
      "inline-flex size-max items-center whitespace-nowrap rounded-full ring-1 ring-inset",
    styles: filledColors,
  },
  [badgeTypes.badgeColor]: {
    common:
      "inline-flex size-max items-center whitespace-nowrap rounded-md ring-1 ring-inset",
    styles: filledColors,
  },
  [badgeTypes.badgeModern]: {
    common:
      "inline-flex size-max items-center whitespace-nowrap rounded-md bg-white text-gray-700 ring-1 ring-inset ring-gray-200 shadow-xs",
    styles: addonOnlyColors,
  },
} satisfies Record<
  BadgeTypes,
  {
    common: string;
    styles: Record<
      string,
      { root: string; addon: string; addonButton?: string }
    >;
  }
>;

export type BadgeColor<T extends BadgeTypes> = BadgeTypeToColorMap<
  typeof withPillTypes
>[T];
