import Image from "next/image";
import React from "react";
import { upload_icon_illustration } from "@/assets/icons";

const EmptyUploadState = () => {
  return (
    <>
      <Image src={upload_icon_illustration} alt="empty-state" />
      <div className="text-sm flex flex-col gap-y-1 text-center">
        <span className="text-xl font-semibold">Add equipment here</span>
        <div>
          <span className="font-semibold text-primary-700 cursor-pointer">
            Click to upload
          </span>{" "}
          <span>or drag and drop</span>
        </div>
        <span>CSV or XLSX</span>
      </div>
    </>
  );
};

export default EmptyUploadState;
