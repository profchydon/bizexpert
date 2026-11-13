import React from "react";
import SummaryCountryCard from "./SummaryCountryCard";
import {
  laptop_blue,
  person,
  catalog_overview,
  blue_safe,
} from "@/assets/icons";
import routes from "@/routes";
import Image from "next/image";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import PageState from "@/components/PageState";
import { useWorkspaceDashboardCountrySummaryQuery } from "@/hooks/useWorkspaceDashboardQueries";
import MapDashboardEmpty from "../CountrySelectMap/EmptyState";
import { IDashboardCountrySummary } from "@/types/dashboard";
import { useMapContext } from "../CountrySelectMap/MapContext";

const MapCountrySummary = () => {
  const { defaultCountry } = useMapContext();

  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();

  const {
    data: dashboadCountrySummaryRes,
    isLoading,
    isError,
  } = useWorkspaceDashboardCountrySummaryQuery({ skip: !company?.id });

  const dashboardCountrySummary = dashboadCountrySummaryRes?.data ?? [];

  const findCountrySummary = dashboardCountrySummary.find(
    (country) => country?.country_id === defaultCountry?.value,
  );

  const cards = (findCountrySummary ?? []) as IDashboardCountrySummary;

  const details = [
    {
      icon: person,
      title: `${cards?.employee_count} employee(s)`,
      description: "View details",
      route: `${routes.EMPLOYEES}?countryId=${defaultCountry?.label}`,
      count: cards?.employee_count,
    },
    {
      icon: laptop_blue,
      title: `${cards?.equipment_count} equipment(s)`,
      description: "View details",
      route: `${routes.ASSET_VAULT}?ci=${defaultCountry?.value}&cn=${defaultCountry?.label}`,
      count: cards?.equipment_count,
    },
    {
      icon: blue_safe,
      title: `${cards?.equipment_in_storage_count} equipment(s) stored`,
      description: "View details",
      route: `${routes.STORAGE}/${defaultCountry?.value}`,
      count: cards?.equipment_in_storage_count,
    },
    {
      icon: catalog_overview,
      title: `${cards?.catalog_count} catalog(s)`,
      description: "View details",
      route: routes.CATALOGS,
      count: cards?.catalog_count,
    },
  ];

  return (
    <PageState isLoading={isLoading} isError={isError}>
      <div className="flex flex-col gap-4 ">
        {!findCountrySummary ? (
          <MapDashboardEmpty />
        ) : (
          details
            .filter((detail) => detail.count > 0)
            .map((detail, index) => (
              <SummaryCountryCard
                key={index}
                icon={
                  <Image
                    src={detail.icon}
                    alt="icon"
                    width={35}
                    height={35}
                    className="mr-2"
                  />
                }
                title={detail.title}
                description={detail.description}
                route={detail.route}
              />
            ))
        )}
      </div>
    </PageState>
  );
};

export default MapCountrySummary;
