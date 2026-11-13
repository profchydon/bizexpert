import { emptystate_gray } from "@/assets/icons";
import Image from "next/image";
import React from "react";

const RemoveItemsEmptyInstance = () => {
  return (
    <div className="grid place-content-center mt-12 w-full mx-auto">
      <Image src={emptystate_gray} alt="emptyState" className="mx-auto" />

      <div className="flex flex-col text-center mt-5">
        <h5 className="text-gray-900 text-lg font-semibold">
          No device to remove
        </h5>
        <p className="text-gray-600 text-sm mt-2">
          Sorry you've either not added or removed all device at the moment
        </p>
      </div>
    </div>
  );
};

export default RemoveItemsEmptyInstance;
