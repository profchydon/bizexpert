import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import React, { FC, ReactNode } from "react";
import { background_login, signup_screen_mockup } from "@/assets/images";

interface Props {
  hasContent?: boolean;
  className?: string;
  bgImageUrl?: StaticImageData;
  children?: ReactNode;
  rightSideImage?: StaticImageData;
}
const LoginLayout: FC<Props> = (props) => {
  const { hasContent, className, bgImageUrl, children, rightSideImage } = props;
  return (
    <div
      className={cn(
        "w-full max-w-[94rem] px-4 lg:px-0 mx-auto h-screen flex flex-row",
        className,
      )}
    >
      <div className="flex-1 flex flex-col items-center justify-center h-screen lg:pb-6 lg:pt-28 lg-1:p-0 lg:overflow-y-scroll [&::-webkit-scrollbar]:appearance-none">
        {children}
      </div>
      <div
        className={`hidden w-full lg:flex-1 lg:flex flex-col  ${hasContent ? "items-end" : "items-center"} h-screen relative overflow-hidden`}
      >
        <div className="absolute -z-10 w-full h-screen">
          <Image
            src={bgImageUrl || background_login}
            alt="bgImageUrl_img"
            className="w-full h-screen object-fill"
            width={720}
            height={960}
          />
        </div>

        {hasContent ? (
          <div className="items-end flex flex-col relative">
            <div className="lg-1:w-[680px] lg-1:h-[571px] lg-1:mt-[2.6875rem]">
              <Image
                src={rightSideImage || signup_screen_mockup}
                alt="login_img"
                className="w-full h-screen object-fill "
                // width={680}
                // height={571}
              />
            </div>
          </div>
        ) : (
          <div className="block lg-1:w-[680px] lg-1:h-[571px] m-auto xl:m-auto">
            <Image
              src={rightSideImage || signup_screen_mockup}
              alt="login_img"
              className="w-full h-screen object-fill"
              //   width={680}
              //   height={571}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginLayout;
