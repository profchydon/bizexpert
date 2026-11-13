"use client";

import React from "react";
import { usePathname } from "next/navigation";
import NavBar from "../dashboard/NavBar";
import { CatalogPolicyCartProvider } from "@/container/Employee/CatalogPolicies/CatalogPolicyCartContext";

interface EmployeeShellProps {
  children: React.ReactNode;
}

const EmployeeShell: React.FC<EmployeeShellProps> = ({ children }) => {
  const pathname = usePathname();
  const isVerifyDelivery = pathname.startsWith("/employee/verify-delivery");

  return (
    <CatalogPolicyCartProvider>
      <NavBar isEmployeeNav />
      <div className={isVerifyDelivery ? "relative" : "mt-24 relative page-px"}>
        {isVerifyDelivery ? children : <div className="w-full">{children}</div>}
      </div>
    </CatalogPolicyCartProvider>
  );
};

export default EmployeeShell;
