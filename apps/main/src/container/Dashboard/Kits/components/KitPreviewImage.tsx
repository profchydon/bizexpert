"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { isKitPreviewPlaceholder, resolveKitPreviewImage } from "../utils";

interface Props {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  containerClassName?: string;
  imageClassName?: string;
  labelClassName?: string;
  showPlaceholderLabel?: boolean;
  isPlaceholder?: boolean;
}

const KitPreviewImage = ({
  src,
  alt,
  width,
  height,
  containerClassName,
  imageClassName,
  labelClassName,
  showPlaceholderLabel = true,
  isPlaceholder,
}: Props) => {
  const placeholder = isPlaceholder ?? isKitPreviewPlaceholder(src);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        containerClassName,
      )}
    >
      <Image
        src={resolveKitPreviewImage(src)}
        alt={alt}
        width={width}
        height={height}
        className={imageClassName}
      />
      {showPlaceholderLabel && placeholder && (
        <span
          className={cn(
            "pointer-events-none absolute bottom-0.5 left-1/2 max-w-[calc(100%-4px)]",
            "-translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-1 py-0.5",
            "text-[7px] font-semibold leading-none text-gray-600 shadow-sm ring-1 ring-gray-200",
            labelClassName,
          )}
        >
          No Image
        </span>
      )}
    </div>
  );
};

export default KitPreviewImage;
