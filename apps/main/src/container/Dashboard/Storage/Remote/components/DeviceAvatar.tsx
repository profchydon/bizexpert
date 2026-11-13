import type { FC } from "react";
import {
  Container,
  Headphones01,
  Keyboard01,
  Laptop01,
  Monitor01,
  Phone01,
  Tablet01,
} from "@untitledui/icons";
import { cx } from "@/utils/cx";

const ICONS: Record<string, FC<{ className?: string }>> = {
  laptop: Laptop01,
  phone: Phone01,
  monitors: Monitor01,
  tablet: Tablet01,
  keyboard: Keyboard01,
  headphones: Headphones01,
  other: Container,
};

type Size = "xs" | "sm" | "md" | "lg";
const BOX: Record<Size, string> = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

interface Props {
  image?: string;
  assetType: string;
  name: string;
  size?: Size;
}

// Circular product chip matching the Asset Vault (Equipment) device look: a gray
// avatar-fill circle with the square product render floating inside at 70% via
// object-contain (so it is never cropped) and a white float rim. Photo-less devices
// fall back to a centered per-asset-type icon in the same circle. Insets are
// percentage-based, so the image and icon scale with any BOX[size].
export function DeviceAvatar({ image, assetType, name, size = "sm" }: Props) {
  const PlaceholderIcon = ICONS[assetType] ?? Container;
  return (
    <span
      className={cx(
        "relative shrink-0 rounded-full bg-tertiary ring-[1.5px] ring-bg-primary",
        BOX[size],
      )}
      title={name}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="absolute inset-[15%] size-[70%] object-contain"
        />
      ) : (
        <PlaceholderIcon className="absolute inset-[25%] size-[50%] text-fg-quaternary" />
      )}
      <span className="absolute inset-0 rounded-full border border-primary/[0.08]" />
    </span>
  );
}
