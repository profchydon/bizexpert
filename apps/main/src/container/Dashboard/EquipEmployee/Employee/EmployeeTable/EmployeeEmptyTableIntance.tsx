import { emptystate_gray } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { FC } from "react";

interface Props {
  handleImport?: () => void;
  handleSelect?: () => void;
  showButtons?: boolean;
}
const EmployeeEmptyTableIntance: FC<Props> = ({
  handleImport,
  handleSelect,
  showButtons = true,
}) => {
  return (
    <div className="grid place-content-center py-11 w-full m-auto">
      <Image src={emptystate_gray} alt="emptyState" className="mx-auto" />

      <div className="flex flex-col text-center mt-5">
        <h5 className="text-gray-900 text-lg font-semibold">
          No employee added
        </h5>
        <p className="text-gray-600 text-sm font-normal mt-2">
          Sorry no employees added at the moment
        </p>

        {showButtons && (
          <div className="flex flex-row mt-8 pl-12 gap-3">
            <Button
              variant="outline"
              onClick={handleImport}
              data-testid="employeeemptytableintance-button"
            >
              Import employees
            </Button>
            <Button
              variant="primary"
              onClick={handleSelect}
              data-testid="employeeemptytableintance-button-2"
            >
              Select employees
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeEmptyTableIntance;
