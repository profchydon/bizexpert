"use client";

import PageHeader from "@/components/PageHeader";
import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import EmployeesRequestTable from "./EmployeeRequestTable";
import { useGetCatalogQuery } from "@/api/baseQueries/companiesApi/catalogsApi/getCatalog";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import routes from "@/routes";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

const EmployeesRequest = () => {
  const { getCompanyDetails, getUserDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const params = useSearchParams();
  const catalogId = params.get("catalogId") as string;

  const { data: catalogRes } = useGetCatalogQuery(
    { catalogId, companyId: companyId! },
    { skip: !catalogId },
  );

  const catalog = catalogRes?.data;

  const router = useRouter();
  return (
    <div className="flex flex-col gap-y-4 py-8">
      <PageHeader
        breadCrumbs={[
          <Link href={routes.CATALOGS}>Catalog</Link>,
          <Link href={`${routes.CATALOGS}/${catalog?.id}`}>
            {catalog?.name}
          </Link>,
          <span className="text-primary-700">Employee Requests</span>,
        ]}
        pageTitle="Employee's request"
        pageDescription="View detailed information for the employee request"
        onBack={() => router.back()}
      >
        {/* <div className="md:self-end pb-6">
          <Button disabled={true} className="text-sm">
            <div className="text-sm font-semibold ">Pay for Order</div>
          </Button>
        </div> */}
      </PageHeader>

      <EmployeesRequestTable catalog={catalog} />
    </div>
  );
};

export default EmployeesRequest;
