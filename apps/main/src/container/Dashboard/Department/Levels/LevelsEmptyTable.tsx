import Image from "next/image";
import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import { empty_page } from "@/assets/images";

const LevelsEmptyTable: React.FC<{ onCreateLevel: () => void }> = ({
  onCreateLevel,
}) => {
  return (
    <div className="grid place-content-center w-full m-auto gap-3 py-11">
      <Image src={empty_page} alt="emptyState" className="mx-auto" />

      <div className="flex flex-col text-center gap-3">
        <h5 className="text-gray-900 text-lg font-semibold">No Levels found</h5>
        <p className="text-gray-600 text-sm">create a level to continue.</p>
        <div className="items-center mt-3">
          <Button onClick={onCreateLevel} data-testid="levelsemptytable-button">
            Create level
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LevelsEmptyTable;
