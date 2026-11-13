import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import Image from "next/image";
import Carousel, { Slider, SliderContainer, ThumsSlider } from "./ui/carousel";

type ThumnailSliderProps = {
  images: string[];
};

const ThumnailSlider: React.FC<ThumnailSliderProps> = ({ images }) => {
  const OPTIONS: EmblaOptionsType = { loop: false };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      <Carousel options={OPTIONS} className="relative" isAutoPlay={true}>
        <SliderContainer className="gap-0">
          {images.map((image, index) => (
            <Slider
              key={image}
              className="h-[320px] w-full overflow-hidden rounded-xl bg-gray-50 sm:h-[360px] xl:h-[420px]"
              thumnailSrc={image}
            >
              <Image
                src={image}
                width={1400}
                height={800}
                alt={`image-${index + 1}`}
                className="h-full w-full rounded-xl object-contain"
              />
            </Slider>
          ))}
        </SliderContainer>
        <ThumsSlider />
      </Carousel>
    </div>
  );
};

export default ThumnailSlider;
