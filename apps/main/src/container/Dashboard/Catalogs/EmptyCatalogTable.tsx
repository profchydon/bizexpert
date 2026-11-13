import Image from "next/image";
import React, { useState } from "react";
import { empty_catalog } from "@/assets/images";
import { Button } from "@/components/ui/button";
import MicroCatalogAccess from "./MicroCatalogAccessModal";

const EmptyCatalogTable = () => {
  const [isMicroCatalogAccessOpen, setIsMicroCatalogAccessOpen] =
    useState(false);
  const toggleMicroCatalogAccess = () =>
    setIsMicroCatalogAccessOpen(!isMicroCatalogAccessOpen);

  return (
    <div className="grid place-content-center gap-y-8 w-full m-auto mt-5">
      <Image src={empty_catalog} alt="emptyState" className="mx-auto" />
      <div className="flex flex-col text-center">
        <h5 className="text-gray-900 text-xl font-semibold gap-y-2">
          No catalog yet
        </h5>
        <p className="text-gray-600 text-sm font-normal">
          Create a catalog of equipment that each unique team can access.
        </p>
      </div>
      <div className="grid place-content-center text-base font-semibold">
        <Button
          onClick={toggleMicroCatalogAccess}
          data-testid="emptycatalogtable-button"
        >
          Create Catalog
        </Button>
      </div>

      <MicroCatalogAccess
        isOpen={isMicroCatalogAccessOpen}
        onClose={toggleMicroCatalogAccess}
      />
    </div>
  );
};

export default EmptyCatalogTable;
