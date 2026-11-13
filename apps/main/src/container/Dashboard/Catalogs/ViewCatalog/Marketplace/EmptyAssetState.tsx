import { search_asset_img } from "@/assets/images";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { FC } from "react";

interface Props {
  handleClear: () => void;
  handleRequest: () => void;
}
const EmptyAssetStateIntance: FC<Props> = ({ handleClear, handleRequest }) => {
  return (
    <div className="grid place-content-center py-11 w-full m-auto">
      <Image src={search_asset_img} alt="emptyState" className="mx-auto" />

      <div className="flex flex-col text-center mt-5">
        <h5 className="text-gray-900 text-lg font-semibold">
          Assets not found
        </h5>
        <p className="text-gray-600 text-sm mt-2">
          Your search/filter did not match any of our products. If you didn't
          find what you're looking for, you can make custom requests and our
          sales team reach out to you directly.
        </p>

        <div className="flex flex-row mt-8 mx-auto pl-12 gap-3">
          <Button
            variant="outline"
            onClick={handleClear}
            data-testid="emptyassetstate-button"
          >
            Clear Search
          </Button>
          <Button
            variant="primary"
            onClick={handleRequest}
            data-testid="emptyassetstate-button-2"
          >
            Custom request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyAssetStateIntance;
