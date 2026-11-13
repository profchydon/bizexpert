import React, { useEffect, useState, FC } from "react";
import Image, { StaticImageData } from "next/image";
import { roundedImage_placeholder } from "@/assets/images";
import {
  isConfiguredRemoteImage,
  resolveSafeImageSrc,
} from "./safeImage.logic";

interface SafeImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: StaticImageData | string;
}

function getImageSrc(value: StaticImageData | string): string {
  return typeof value === "string" ? value : value.src;
}

export const SafeImage: FC<SafeImageProps> = ({
  src,
  alt = "Image",
  width = 60,
  height = 60,
  className,
  fallback = roundedImage_placeholder,
}) => {
  const [hasError, setHasError] = useState(false);
  const placeholderSrc = getImageSrc(fallback);
  const imageSrc = resolveSafeImageSrc(src, hasError, placeholderSrc);
  const usesNativeImage =
    !hasError &&
    Boolean(src) &&
    imageSrc.startsWith("http") &&
    !isConfiguredRemoteImage(imageSrc);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (usesNativeImage) {
    return (
      <img
        key={imageSrc}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <Image
      key={imageSrc}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
