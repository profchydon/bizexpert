"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import bannerImage from "@/assets/images/long-image.svg";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import EmployeeDetail from "./EmployeeDetail";
import { Separator } from "@/components/ui/separator";
import Assets from "./Assets";
import routes from "@/routes";
import Link from "next/link";
import PageState from "@/components/PageState";
import { useGetEmployeeDashboardQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployeeDashboard";
import { AwaitingApprovalsPanel } from "@/container/Dashboard/Approvals/AwaitingApprovalsPanel";
import Catalogs from "./Catalogs";
import {
  employeeOverviewCatalogCopy,
  employeeOverviewSectionOrder,
  type EmployeeOverviewSection,
} from "./overviewLayout";

const Overview = () => {
  const { getCompanyDetails, getUserInitials, getUserDetails } =
    useAuthUserDetail();
  const company = getCompanyDetails();
  const user = getUserDetails();
  const userInitials = getUserInitials();

  const {
    data: dashboardRes,
    isError,
    isLoading,
  } = useGetEmployeeDashboardQuery({
    companyId: company?.id!,
    employeeId: user?.id!,
  });
  const employee = dashboardRes?.data;
  const assets = employee?.equipment ?? [];
  // const catalogs = employee?.catalogs ?? [];
  const catalogPolicies = employee?.catalog_policies ?? [];
  const sections: Record<EmployeeOverviewSection, React.ReactNode> = {
    approvals: <AwaitingApprovalsPanel />,
    "catalog-policies": (
      <Catalogs
        catalogs={catalogPolicies}
        title={employeeOverviewCatalogCopy.title}
        description={employeeOverviewCatalogCopy.description}
        emptyTitle={employeeOverviewCatalogCopy.emptyTitle}
        emptyDescription={employeeOverviewCatalogCopy.emptyDescription}
        hrefBase={routes.EMPLOYEE_CATALOG_POLICIES}
        showOrderLink
      />
    ),
    assets: <Assets assets={assets} />,
  };

  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className="absolute left-0 top-0 w-full -mt-6">
        <div className="h-[240px] relative">
          <Image
            src={bannerImage}
            alt="banner"
            className="w-full object-cover h-full"
          />
          <div className="flex justify-between items-center mt-3 page-px mb-5 absolute w-full -bottom-36">
            <div className="flex items-center gap-x-5">
              <Avatar className="h-[160px] w-[160px] shadow-2xl">
                <AvatarFallback className="bg-gray-100 border-white border-4 text-[60px] font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {employee?.first_name} {employee?.last_name}
                  {employee?.job_title && `(${employee?.job_title})`}
                </h1>
                <p className="mt-2 w-[60ch] truncate" title={employee?.address}>
                  {employee?.address}
                </p>
              </div>
            </div>

            <Link href={routes.EMPLOYEE_PROFILE}>
              <Button className="text-white" data-testid="overview-button">
                Edit profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <EmployeeDetail employee={employee} />

      <div className="flex flex-col gap-y-12">
        <Separator />
        {employeeOverviewSectionOrder.map((section, index) => (
          <React.Fragment key={section}>
            {index > 0 ? <Separator /> : null}
            {sections[section]}
          </React.Fragment>
        ))}

        {/* <Separator />

        <Catalogs catalogs={catalogs} /> */}
      </div>
    </PageState>
  );
};

export default Overview;
