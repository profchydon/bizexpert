"use client";

import { useGetEntityQuery } from "@/api/baseQueries/companiesApi/entitiesApi/getEntity";
import { mapEntityBillingCurrency } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityBillingCurrency";
import { mapEntityCountryLabel } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityCountryLabel";
import { resolveEntityCountryCode } from "@/app/dashboard/NavBar/resolveEntityCountryCode";
import { currencySymbol as getCurrencySymbol } from "@/utils/currencySymbol";
import type { IDashboard } from "@/types/dashboard";
import DoingToday from "./DoingToday";
// import { FleetHealthStrip } from "./FleetHealthStrip";
import { EntityFootprintSection } from "./EntityFootprintSection";
import { OverviewScopedHeader } from "./OverviewScopedHeader";
import { SetupBanner } from "./SetupBanner";
import Summary from "./Summary";
import WhatsHappening from "./WhatsHappening";
import { dashboardOverviewCards } from "./dashboardOverviewCards";
import { entityOverviewSubtitle } from "./overviewTier";

export function EntityOverviewBody({
  entityId,
  dashboardData,
}: Readonly<{
  entityId: string;
  dashboardData?: IDashboard;
}>) {
  const entityQuery = useGetEntityQuery({ entityId }, { skip: !entityId });
  const entity = entityQuery.data?.data;
  const region = mapEntityCountryLabel(entity?.country);
  const currency = entity ? mapEntityBillingCurrency(entity) : "";
  const countryCode = entity
    ? resolveEntityCountryCode(entity.country)
    : undefined;

  return (
    <>
      <OverviewScopedHeader
        title={entity?.name ?? "Overview"}
        subtitle={entityOverviewSubtitle(region, currency)}
        countryCode={countryCode}
      />
      {/* <FleetHealthStrip /> */}
      <SetupBanner />
      {dashboardData ? (
        <>
          <Summary
            summaryData={dashboardOverviewCards(dashboardData)}
            currencySymbol={getCurrencySymbol(currency)}
          />
          <DoingToday />
          <div className="mt-8 space-y-6">
            <EntityFootprintSection
              dashboard={dashboardData}
              region={region}
              currency={currency}
            />
            <WhatsHappening
              showMap={false}
              showHeading={false}
              showCatalogRequests={false}
              country={region || undefined}
            />
          </div>
        </>
      ) : null}
    </>
  );
}
