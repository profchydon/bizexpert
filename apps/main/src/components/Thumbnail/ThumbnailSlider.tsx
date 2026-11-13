import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ThumbnailPlugin from "@/lib/ThumbnailPlugin";
import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode[];
}
const ThumbnailSlider: FC<Props> = ({ children }) => {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
  });
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: 4,
        spacing: 10,
      },
    },
    [ThumbnailPlugin(instanceRef)],
  );

  return (
    <>
      <div ref={sliderRef} className="keen-slider">
        {children[0]}
      </div>

      {children[1] && (
        <div ref={thumbnailRef} className="keen-slider thumbnail mt-6">
          {children[1]}
        </div>
      )}
    </>
  );
};

export default ThumbnailSlider;
