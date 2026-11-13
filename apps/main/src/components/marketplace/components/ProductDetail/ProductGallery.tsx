import Image from "next/image";

export interface ProductGalleryProps {
  images: string[];
  alt: string;
  fallbackImageSrc?: string;
}

export const ProductGallery = ({
  images,
  alt,
  fallbackImageSrc,
}: ProductGalleryProps) => {
  const primaryImage = images?.[0] ?? fallbackImageSrc;

  return (
    <section className="mp-flex mp-h-auto mp-w-full mp-flex-col mp-rounded-[24px] lg:mp-w-[488px]">
      {primaryImage ? (
        <div className="mp-h-auto mp-w-full mp-rounded-2xl mp-border mp-border-gray-200 mp-bg-white mp-p-3 mp-shadow-sm lg:mp-w-[488px]">
          <Image
            src={primaryImage}
            alt={alt}
            width={488}
            height={420}
            className="mp-h-[320px] mp-w-full mp-rounded-xl mp-bg-gray-50 mp-object-contain mp-p-4 sm:mp-h-[360px] xl:mp-h-[420px]"
          />
        </div>
      ) : (
        <div className="mp-flex mp-h-[320px] mp-w-full mp-items-center mp-justify-center mp-rounded-2xl mp-border mp-border-gray-200 mp-bg-gray-50 mp-text-sm mp-text-gray-500 sm:mp-h-[360px] xl:mp-h-[420px] lg:mp-w-[488px]">
          No available image
        </div>
      )}

      {images && images.length > 1 && (
        <div className="mp-mt-3 mp-flex mp-gap-2 mp-overflow-x-auto">
          {images.slice(1, 6).map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="mp-h-16 mp-w-16 mp-shrink-0 mp-overflow-hidden mp-rounded-lg mp-border mp-border-gray-200 mp-bg-white"
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${index + 2}`}
                width={64}
                height={64}
                className="mp-h-full mp-w-full mp-object-contain mp-p-1"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
