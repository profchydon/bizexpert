import { lottie_globe } from "@/assets/images";
import React from "react";
import Lottie from "lottie-react";

const MapDashboardEmpty = () => {
  return (
    <div className="flex flex-row items-center justify-center text-center bg-white">
      <div
        className="overflow-hidden "
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, #FFFFFF 0%, #C0C7D2 92.31%, rgba(255, 255, 255, 0.2) 100%)",
        }}
      >
        <Lottie animationData={lottie_globe} />
      </div>
    </div>
  );
};

export default MapDashboardEmpty;
