"use client";

import OffboardingOrderSummary from "@/components/Offboarding/OrderSummary";
import routes from "@/routes";
import Link from "next/link";
import React from "react";

const EmployeesOrderSummary = () => {
  const breadCrumbs = [
    <Link className="cursor-pointer" href={routes.EMPLOYEES}>
      Employees
    </Link>,
    <Link className="cursor-pointer" href={`${routes.EMPLOYEES}/view-actions`}>
      See actions
    </Link>,
    <span className="text-primary-600">Order Summary</span>,
  ];
  return (
    <div>
      <OffboardingOrderSummary
        baseRoute={routes.EMPLOYEES}
        breadCrumbs={breadCrumbs}
      />
    </div>
  );
};

export default EmployeesOrderSummary;
