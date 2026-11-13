"use client";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import EmployeesTable from "./EmployeesTable";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import Link from "next/link";
import { useAppSelector } from "@/store";
import routes from "@/routes";
import ActionsDrawer from "./Actions";
import { IoMdArrowBack } from "react-icons/io";

const SelectEmployees = () => {
  const selectedEmployees = useAppSelector(
    (state) => state.persistedReducers.employee.selectedEmployee,
  );
  const router = useRouter();

  const [isActionOpen, setIsActionOpen] = useState(false);

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  return (
    <div className="flex flex-col py-8">
      <PageHeader
        breadCrumbs={[
          <Link href={routes.STORAGE}>Storage</Link>,
          <span className="text-primary-600">Select employees</span>,
        ]}
        pageTitle="Select Employees"
        pageDescription="Select employees you want the devices to be assigned to."
        onBack={() => router.back()}
      >
        <div className="md:self-end flex gap-3 pb-5">
          <Button
            variant="outline"
            className="gap-x-2 items-center md:flex hidden"
            onClick={() => router.back()}
            data-testid="selectemployees-button"
          >
            <IoMdArrowBack className="text-gray-600 text-xl" />
            <span className="text-gray-600 text-sm font-semibold">
              Back to equipment
            </span>
          </Button>

          <Button
            className="text-sm space-x-2"
            disabled={!selectedEmployees || selectedEmployees?.length === 0}
            onClick={() => {
              setIsActionOpen(true);
            }}
            data-testid="selectemployees-button-2"
          >
            <span className="bg-white py-[2px] px-2 text-primary-700 font-medium text-xs rounded-full">
              {selectedEmployees?.length}
            </span>
            <span className="font-semibold">View actions</span>
          </Button>
        </div>
      </PageHeader>

      <div className="mt-8">
        <EmployeesTable />
      </div>

      <ActionsDrawer
        isOpen={isActionOpen}
        onClose={() => setIsActionOpen(false)}
      />
    </div>
  );
};

export default SelectEmployees;
