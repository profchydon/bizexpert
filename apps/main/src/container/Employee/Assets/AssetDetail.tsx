"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import PageState from "@/components/PageState";
import { useGetAssignedTelemetryDeviceQuery } from "@/api/baseQueries/companiesApi/telemetryApi";
import { useGetEmployeeDashboardQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployeeDashboard";
import { mapLiveTelemetry } from "@/container/Dashboard/AllEquipments/ViewEquipment/telemetry/mapLiveTelemetry";
import { telemetryEligible } from "@/container/Dashboard/AllEquipments/ViewEquipment/telemetry/eligibility";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import routes from "@/routes";
import { TelemetryCard } from "./TelemetryCard";

export default function EmployeeAssetDetail() {
  const params = useParams();
  const assetId = String(params?.assetId ?? "");
  const { getCompanyDetails, getUserDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const user = getUserDetails();
  const dashboard = useGetEmployeeDashboardQuery({
    companyId: company?.id!,
    employeeId: user?.id!,
  });
  const asset = dashboard.data?.data.equipment?.find(
    (item) => item.id === assetId,
  );
  const telemetryQuery = useGetAssignedTelemetryDeviceQuery(
    { companyId: company?.id ?? "", deviceId: assetId },
    { skip: !company?.id || !assetId || !telemetryEligible(asset?.type) },
  );

  if (dashboard.isLoading || telemetryQuery.isLoading) {
    return <PageState isLoading isError={false} />;
  }

  if (dashboard.isError || !asset) {
    return <PageState isLoading={false} isError />;
  }

  const telemetry = telemetryQuery.data?.data
    ? mapLiveTelemetry(telemetryQuery.data.data)
    : telemetryEligible(asset.type)
      ? mapLiveTelemetry({
          equipment_id: asset.id ?? assetId,
          device_id: asset.serial_number ?? null,
          title: asset.title,
          serial_number: asset.serial_number ?? null,
          type: asset.type,
          company_id: company?.id ?? "",
          office_id: null,
          owner_type: null,
          owner_id: null,
          telemetry_ownership: null,
          assignee: null,
          agent: null,
          telemetry: null,
          flags: {
            no_agent: true,
            revoked: false,
            reporting: false,
            stale: false,
          },
        })
      : null;

  return (
    <div className="flex flex-col gap-6 py-8">
      <Link
        href={routes.EMPLOYEE_ASSETS}
        className="text-sm font-medium text-brand-secondary"
      >
        Back to my assets
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-primary">{asset.title}</h1>
        <p className="mt-1 text-sm text-tertiary">{asset.serial_number}</p>
      </div>
      <TelemetryCard telemetry={telemetry} />
    </div>
  );
}
