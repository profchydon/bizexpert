import { emptyEquipment_grey } from "@/assets/icons";
import Image from "next/image";
import React from "react";

const EmployeesEmptyTable = () => {
  return (
    <div className="grid place-content-center py-11 w-full m-auto">
      <Image src={emptyEquipment_grey} alt="emptyState" className="mx-auto" />

      <div className="flex flex-col text-center mt-5">
        <h5 className="text-gray-900 text-lg font-semibold">
          No employees yet
        </h5>
        <p className="text-gray-600 text-sm mt-2">
          You have no employee yet, add/import employees.
        </p>
      </div>
    </div>
  );
};

export default EmployeesEmptyTable;
