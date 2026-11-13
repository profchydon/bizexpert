"use client";

import OffboardingOrderSummary from "@/components/Offboarding/OrderSummary";
import routes from "@/routes";
import Link from "next/link";
import React from "react";

const AllEquipmentOrderSummary = () => {
  const breadCrumbs = [
    <Link className="cursor-pointer" href={routes.All_Equipments}>
      Asset vault
    </Link>,
    <Link
      className="cursor-pointer"
      href={`${routes.All_Equipments}/view-actions`}
    >
      See actions
    </Link>,
    <span className="text-primary-600">Order Summary</span>,
  ];
  return (
    <div>
      <OffboardingOrderSummary
        baseRoute={routes.All_Equipments}
        breadCrumbs={breadCrumbs}
      />
    </div>
  );
};

export default AllEquipmentOrderSummary;
