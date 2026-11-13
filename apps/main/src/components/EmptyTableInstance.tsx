// import { emptyEquipment_grey } from "@/assets/icons";
import { empty_ash } from "@/assets/images";
import Image from "next/image";
import React, { FC } from "react";
import { Button } from "./ui/button";

interface Props {
  title: string;
  description: string;
  onButtonClick?: () => void;
  buttonText?: React.ReactNode;
}

const EmptyTableInstance: React.FC<Props> = ({
  description,
  title,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="grid place-content-center py-11 w-full m-auto">
      <Image src={empty_ash} alt="emptyState" className="mx-auto" />

      <div className="flex flex-col text-center mt-5">
        <h5 className="text-gray-900 text-lg font-semibold">{title}</h5>
        <p className="text-gray-600 text-sm mt-2">{description}</p>
      </div>

      {buttonText && (
        <div className="grid place-content-center mt-4">
          <Button
            onClick={onButtonClick}
            type="button"
            className="text-base"
            variant={"primary"}
            data-testid="emptytableinstance-button"
          >
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyTableInstance;
