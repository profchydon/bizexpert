"use client";
import ViewActions from "@/components/Offboarding/ViewActions";
import routes from "@/routes";
import Link from "next/link";
import React from "react";

const OffboardingViewActions = () => {
  const breadCrumbs = [
    <Link className="cursor-pointer" href={routes.OFFBOARDING}>
      Off-boarding
    </Link>,
    <span className="text-primary-600">See actions</span>,
  ];
  return (
    <div>
      <ViewActions
        baseRoute={routes.OFFBOARDING}
        breadCrumbs={breadCrumbs}
        secondaryButtonText="Return to off-boarding"
      />
    </div>
  );
};

export default OffboardingViewActions;
