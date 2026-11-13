"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  badgeTypes,
  BadgeColors,
  BadgeTypes,
  IconComponentType,
  Sizes,
} from "./badge-types";
import { withPillTypes } from "./styles";

const iconSizes = {
  [badgeTypes.pillColor]: {
    sm: "p-1.25",
    md: "p-1.5",
    lg: "p-2",
  },
  [badgeTypes.badgeColor]: {
    sm: "p-1.25",
    md: "p-1.5",
    lg: "rounded-lg p-2",
  },
  [badgeTypes.badgeModern]: {
    sm: "p-1.25",
    md: "p-1.5",
    lg: "rounded-lg p-2",
  },
};

const imageSizes = {
  [badgeTypes.pillColor]: {
    sm: "gap-1 py-0.5 pl-0.75 pr-2 text-xs font-medium",
    md: "gap-1.5 py-0.5 pl-1 pr-2.5 text-sm font-medium",
    lg: "gap-1.5 py-1 pl-1.5 pr-3 text-sm font-medium",
  },
  [badgeTypes.badgeColor]: {
    sm: "gap-1 py-0.5 pl-1 pr-1.5 text-xs font-medium",
    md: "gap-1.5 py-0.5 pl-1.5 pr-2 text-sm font-medium",
    lg: "rounded-lg gap-1.5 py-1 pl-2 pr-2.5 text-sm font-medium",
  },
  [badgeTypes.badgeModern]: {
    sm: "gap-1 py-0.5 pl-1 pr-1.5 text-xs font-medium",
    md: "gap-1.5 py-0.5 pl-1.5 pr-2 text-sm font-medium",
    lg: "rounded-lg gap-1.5 py-1 pl-2 pr-2.5 text-sm font-medium",
  },
};

const resolveColor = (type: BadgeTypes, color: BadgeColors) => {
  const style = withPillTypes[type];
  const safeColor = type === badgeTypes.badgeModern ? "gray" : color;
  const styleMap = style.styles as Record<
    string,
    { root: string; addon: string; addonButton?: string }
  >;
  return styleMap[safeColor] ?? styleMap.gray;
};

interface BadgeWithImageProps<T extends BadgeTypes> {
  type?: T;
  size?: Sizes;
  imgSrc: string;
  color?: BadgeColors;
  children: ReactNode;
}

export const BadgeWithImage = ({
  type = badgeTypes.pillColor,
  size = "md",
  color = "gray",
  imgSrc,
  children,
}: Readonly<BadgeWithImageProps<BadgeTypes>>) => {
  const style = withPillTypes[type];
  const colorStyle = resolveColor(type, color);

  return (
    <span className={cn(style.common, imageSizes[type][size], colorStyle.root)}>
      <img
        src={imgSrc}
        className="size-4 max-w-none rounded-full"
        alt="Badge"
      />
      {children}
    </span>
  );
};

interface BadgeIconProps<T extends BadgeTypes> {
  type?: T;
  size?: Sizes;
  icon: IconComponentType;
  color?: BadgeColors;
  children?: ReactNode;
}

export const BadgeIcon = ({
  type = badgeTypes.pillColor,
  size = "md",
  color = "gray",
  icon: Icon,
}: Readonly<BadgeIconProps<BadgeTypes>>) => {
  const style = withPillTypes[type];
  const colorStyle = resolveColor(type, color);

  return (
    <span className={cn(style.common, iconSizes[type][size], colorStyle.root)}>
      <Icon className={cn("size-3 stroke-[3px]", colorStyle.addon)} />
    </span>
  );
};
