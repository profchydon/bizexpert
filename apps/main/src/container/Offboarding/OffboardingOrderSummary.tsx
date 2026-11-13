"use client";

import OffboardingOrderSummary from "@/components/Offboarding/OrderSummary";
import routes from "@/routes";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const OffboardingOrderSummaryContainer = () => {
  const params = useSearchParams();
  const isEmployeeOffboarding = params.get("isEmployeeOffboarding");

  const employeeBreadCrumbs = [
    <Link className="cursor-pointer" href={routes.EMPLOYEES} key="employees">
      Employees
    </Link>,
    <Link
      className="cursor-pointer"
      href={routes.EMPLOYEES_OFFBOARD_SUMMARY}
      key="review"
    >
      Off-board Review
    </Link>,
    <span className="text-primary-600" key="summary">
      Order Summary
    </span>,
  ];

  const offboardingBreadCrumbs = [
    <Link
      className="cursor-pointer"
      href={routes.OFFBOARDING}
      key="offboarding"
    >
      Off-boarding
    </Link>,
    <Link
      className="cursor-pointer"
      href={`${routes.OFFBOARDING}/view-actions`}
      key="actions"
    >
      See actions
    </Link>,
    <span className="text-primary-600" key="summary">
      Order Summary
    </span>,
  ];

  const breadCrumbs = isEmployeeOffboarding
    ? employeeBreadCrumbs
    : offboardingBreadCrumbs;

  return (
    <OffboardingOrderSummary
      baseRoute={routes.OFFBOARDING}
      breadCrumbs={breadCrumbs}
    />
  );
};

export default OffboardingOrderSummaryContainer;
