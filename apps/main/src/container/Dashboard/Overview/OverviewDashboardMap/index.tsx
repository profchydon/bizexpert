"use client";

import PageState from "@/components/PageState";
import { useWorkspaceDashboardCountrySummaryQuery } from "@/hooks/useWorkspaceDashboardQueries";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { GlobalPresenceCard } from "../GlobalPresenceCard";
import { mapDashboardCountrySummary } from "../GlobalPresenceCard/mapDashboardCountrySummary";

const OverviewDashboardMap = () => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const { data, isError, isLoading, isFetching } =
    useWorkspaceDashboardCountrySummaryQuery({ skip: !company?.id });

  const countries = mapDashboardCountrySummary(data?.data ?? []);

  return (
    <PageState isError={isError} isLoading={isLoading || isFetching}>
      <GlobalPresenceCard data={countries} />
    </PageState>
  );
};

export default OverviewDashboardMap;
