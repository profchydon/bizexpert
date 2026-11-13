import React, { FC } from "react";
import SalesPriceCard from "./SalesPriceCard";
import { IEquipment } from "@/types/equipments";

interface Props {
  equipmentDB: IEquipment;
  estimatedPrice: string;
}
const SingleInstance: FC<Props> = ({ equipmentDB, estimatedPrice }) => {
  return (
    <SalesPriceCard
      image={equipmentDB?.image_url || ""}
      name={`${equipmentDB?.title} ${equipmentDB?.make} ${equipmentDB?.year}`}
      estimatedPrice={estimatedPrice}
    />
  );
};

export default SingleInstance;
