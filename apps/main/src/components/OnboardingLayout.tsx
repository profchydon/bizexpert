import { star_black } from "@/assets/icons";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import React, { FC, ReactNode } from "react";
import { background_signup, signup_screen_mockup } from "@/assets/images";

interface Props {
  hasContent?: boolean;
  className?: string;
  bgImageUrl?: StaticImageData;
  children?: ReactNode;
  rightSideImage?: StaticImageData;
}
const OnboardingLayout: FC<Props> = (props) => {
  const { hasContent, className, bgImageUrl, children, rightSideImage } = props;
  return (
    <div
      className={cn(
        "w-full max-w-[90rem] px-4 lg:px-0 mx-auto h-seen flex flex-row",
        className,
      )}
    >
      <div className="flex-1 flex flex-col items-center justify-center h-screen lg:pb-6 lg:pt-20 lg-1:p-0 lg:overflow-y-scroll [&::-webkit-scrollbar]:appearance-none">
        {children}
      </div>
      <div
        className={`hidden w-full lg:flex-1 lg:flex flex-col  ${hasContent ? "items-end" : "items-center"} h-screen relative overflow-hidden`}
      >
        <div className="absolute -z-10 w-full h-screen">
          <Image
            src={bgImageUrl || background_signup}
            alt="bgImageUrl_img"
            className="w-full h-screen object-fill"
            width={720}
            height={960}
          />
        </div>

        {hasContent ? (
          <div className="mt-auto items-end flex flex-col">
            <div className="w-full max-w-xl gap-y-6 mr-[1.5rem] lg-1:mr-[4rem] space-y-6">
              <p className="text-gray-900 text-3xl leading-[2.375rem]">
                Rayda Remote has been a game-changer for our startup. The
                seamless onboarding process and rapid delivery mean our new
                hires are productive from day one. We couldn't be happier with
                the service!
              </p>
              <div className="flex flex-row justify-between items-start">
                <div className="flex flex-col ">
                  <p className="text-lg font-semibold text-gray-900">
                    — Aliah Lane
                  </p>
                  <small className="text-gray-600 font-medium text-sm leading-[1.125rem]">
                    Founder, Layers.io
                  </small>
                </div>
                <div className="flex flex-row items-center">
                  <Image
                    src={star_black}
                    alt="star_icon"
                    width={20}
                    height={20}
                  />
                  <Image
                    src={star_black}
                    alt="star_icon"
                    width={20}
                    height={20}
                  />
                  <Image
                    src={star_black}
                    alt="star_icon"
                    width={20}
                    height={20}
                  />
                  <Image
                    src={star_black}
                    alt="star_icon"
                    width={20}
                    height={20}
                  />
                  <Image
                    src={star_black}
                    alt="star_icon"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
            </div>
            <div className="lg-1:w-[680px] lg-1:h-[571px] lg-1:mt-[2.6875rem]">
              <Image
                src={rightSideImage || signup_screen_mockup}
                alt="onboarding_img"
                className="w-full object-fill"
                width={680}
                height={571}
              />
            </div>
          </div>
        ) : (
          <div className="block lg-1:w-[680px] lg-1:h-[571px] m-auto">
            <Image
              src={rightSideImage || signup_screen_mockup}
              alt="onboarding_img"
              className="w-full object-fill"
              width={680}
              height={571}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingLayout;
