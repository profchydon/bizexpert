import { emptyEquipment_grey } from "@/assets/icons";
import Image from "next/image";
import React, { FC } from "react";

interface Props {
  title?: string;
  description?: string;
}

const CountriesEmptyTable: FC<Props> = ({
  title = "No available countries yet",
  description = "There are no available countries yet.",
}) => (
  <div className="m-auto grid w-full place-content-center py-11">
    <Image src={emptyEquipment_grey} alt="emptyState" className="mx-auto" />
    <div className="mt-5 flex flex-col text-center">
      <h5 className="text-lg font-semibold text-gray-900">{title}</h5>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

export default CountriesEmptyTable;
