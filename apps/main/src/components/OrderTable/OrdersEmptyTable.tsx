import { emptyEquipment_grey } from "@/assets/icons";
import Image from "next/image";
import React, { FC } from "react";

const OrdersEmptyTable = () => {
  return (
    <div className="grid place-content-center py-11 w-full m-auto">
      <Image src={emptyEquipment_grey} alt="emptyState" className="mx-auto" />

      <div className="flex flex-col text-center mt-5">
        <h5 className="text-gray-900 text-lg font-semibold">No orders yet</h5>
        <p className="text-gray-600 text-sm mt-2">
          You have no orders yet, place an order from marketplace to view
          orders.
        </p>
      </div>
    </div>
  );
};

export default OrdersEmptyTable;
