"use client";

import ViewActions from "@/components/Offboarding/ViewActions";
import routes from "@/routes";
import Link from "next/link";
import React from "react";

const AllEquipmentViewActions = () => {
  const breadCrumbs = [
    <Link className="cursor-pointer" href={routes.All_Equipments}>
      Asset vault
    </Link>,
    <span className="text-primary-600">See actions</span>,
  ];

  return (
    <div>
      <ViewActions
        baseRoute={routes.All_Equipments}
        breadCrumbs={breadCrumbs}
        secondaryButtonText="Return to asset vault"
      />
    </div>
  );
};

export default AllEquipmentViewActions;
