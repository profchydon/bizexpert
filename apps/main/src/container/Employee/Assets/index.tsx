"use client";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import dummyImg from "@/assets/images/Dell.svg";
import { Badge } from "@/components/ui/badge";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useGetEmployeeDashboardQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployeeDashboard";
import PageState from "@/components/PageState";
import EmptyTableInstance from "@/components/EmptyTableInstance";
import { trackEmployeeAssetViewed } from "@/lib/employeePortalAnalytics";
import routes from "@/routes";

const EmployeeAssets = () => {
  const { getCompanyDetails, getUserDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const user = getUserDetails();

  const {
    data: dashboardRes,
    isError,
    isLoading,
  } = useGetEmployeeDashboardQuery({
    companyId: company?.id!,
    employeeId: user?.id!,
  });
  const assets = dashboardRes?.data.equipment ?? [];

  useEffect(() => {
    if (!isLoading && !isError) {
      trackEmployeeAssetViewed();
    }
  }, [isError, isLoading]);

  return (
    <PageState isError={isError} isLoading={isLoading}>
      <div className="font-semibold text-2xl text-gray-900 pt-8">My assets</div>
      <Separator className="my-6" />

      {assets.length > 0 && (
        <div className="flex flex-col gap-y-6">
          {assets.map((data) => (
            <Link
              key={data.id}
              href={`${routes.EMPLOYEE_ASSETS}/${data.id}`}
              className="flex flex-col gap-y-6 cursor-pointer"
            >
              <div className="flex gap-x-6 items-center">
                <Image src={dummyImg} alt="" className="h-[120px] w-[120px]" />

                <div className="flex flex-col gap-y-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {data.title}
                  </h2>

                  <div className="flex gap-x-3 items-center">
                    <div className="flex flex-col gap-y-1">
                      <span className="text-xs text-gray-400">Usage time</span>
                      <span className="text-sm text-gray-900">
                        {data.usage_time_in_days}
                      </span>
                    </div>

                    <div className="flex flex-col gap-y-1">
                      <span className="text-xs text-gray-400">Catalog</span>
                      <span className="text-sm text-primary-600 font-medium">
                        {data.catalog ? (
                          "Catalog"
                        ) : (
                          <Badge variant="red">Not available</Badge>
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Badge variant={"success"} className="text-xs">
                      Ordered
                    </Badge>
                  </div>
                </div>
              </div>
              <Separator />
            </Link>
          ))}
        </div>
      )}

      {assets.length === 0 && (
        <EmptyTableInstance
          description="You don’t have any assets assigned to you yet."
          title="No assets assigned yet"
        />
      )}
    </PageState>
  );
};

export default EmployeeAssets;
