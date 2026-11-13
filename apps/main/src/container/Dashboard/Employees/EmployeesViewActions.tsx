"use client";

import ViewActions from "@/components/Offboarding/ViewActions";
import routes from "@/routes";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const EmployeesViewActions = () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const employeeId = queryParams.get("employeeId") as string;
  const isEmployeeOffboarding = queryParams.get(
    "isEmployeeOffboarding",
  ) as string;

  const breadCrumbs = [
    <Link className="cursor-pointer" href={routes.EMPLOYEES}>
      Employees
    </Link>,
    <span className="text-primary-600">See actions</span>,
  ];

  return (
    <div>
      <ViewActions
        baseRoute={routes.EMPLOYEES}
        breadCrumbs={breadCrumbs}
        secondaryButtonText="Return to employee"
        handleSecondaryButton={() => router.push(`${routes.EMPLOYEES}`)}
        handleCheckout={() => {
          router.push(
            `${routes.EMPLOYEES}/order-summary?isEmployeeOffboarding=${isEmployeeOffboarding}`,
          );
        }}
      />
    </div>
  );
};

export default EmployeesViewActions;
