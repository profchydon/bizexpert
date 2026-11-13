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

      <div className="mt-5 flex flex-col text-center">
        <h5 className="text-lg font-semibold text-gray-900">
          No devices found
        </h5>
        <p className="mt-2 text-sm text-gray-600">
          Try a different search term or adjust your filters.
        </p>

        <div className="mx-auto mt-8 flex flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleClear}
            data-testid="emptyassetstate-button"
          >
            Clear search
          </Button>
          <Button
            variant="primary"
            onClick={handleRequest}
            data-testid="emptyassetstate-button-2"
          >
            RFQ Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyAssetStateIntance;
