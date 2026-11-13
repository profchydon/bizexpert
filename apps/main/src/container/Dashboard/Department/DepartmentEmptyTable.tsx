"use client";
import { useState } from "react";
import { empty_page } from "@/assets/images";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import CreateDepartment from "./CreateDepartment";

const DepartmentEmptyTable = () => {
  const [isCreateDepartmentOpen, setIsCreateDepartmentOpen] = useState(false);
  const toggleCreateDepartment = () =>
    setIsCreateDepartmentOpen(!isCreateDepartmentOpen);

  return (
    <div className="grid place-content-center gap-y-8 w-full m-auto mt-5">
      <Image src={empty_page} alt="emptyState" className="mx-auto" />

      <div className="flex flex-col text-center gap-y-2">
        <h5 className="text-gray-900 text-lg font-semibold">
          No department found
        </h5>
        <p className="text-gray-600 text-sm">
          Create a department to continue.
        </p>
      </div>
      <div className="text-center font-semibold">
        <Button
          variant="primary"
          onClick={toggleCreateDepartment}
          data-testid="departmentemptytable-button"
        >
          Create department
        </Button>
      </div>

      <CreateDepartment
        isOpen={isCreateDepartmentOpen}
        onClose={toggleCreateDepartment}
      />
    </div>
  );
};

export default DepartmentEmptyTable;
