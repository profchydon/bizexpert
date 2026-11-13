import { useMemo } from "react";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { companyBillingCurrency } from "@/utils/companyBillingCurrency";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { getAdministeredEntityIds } from "@/utils/workspace/activeWorkspace";
import { resolveEntityCountryCode } from "@/app/dashboard/NavBar/resolveEntityCountryCode";
import { regionCountryCode } from "@/container/Dashboard/Accounts/data/regionCountryCodes";
import {
  canShowOrderingForBanner,
  resolveOrderingForTarget,
} from "./orderingForTarget";
import { useOfficeMarketplace } from "./useOfficeMarketplace";

type CountryRef = Parameters<typeof resolveEntityCountryCode>[0];

const countryCodeOf = (country?: CountryRef | null) =>
  country ? resolveEntityCountryCode(country) : undefined;

export function useOrderingFor() {
  const { getCompanyDetails, getEntityMemberships } = useAuthUserDetail();
  const { access, activeEntityId, isGlobalWorkspace } = useActiveWorkspace();
  const { office } = useOfficeMarketplace();
  const company = getCompanyDetails();
  const memberships = getEntityMemberships();
  const activeMembership = memberships.find(
    (membership) => membership.id === activeEntityId,
  );
  const primaryMembership = memberships.find(
    (membership) => membership.is_primary,
  );
  const officeOwnerMembership = memberships.find(
    (membership) => membership.id === office?.subsidiaryId,
  );

  const target = useMemo(
    () =>
      resolveOrderingForTarget({
        officeName: office?.name,
        officeCountryCode:
          regionCountryCode[office?.region ?? ""] ??
          countryCodeOf(office?.region),
        officeCurrency: office?.currency,
        isGlobalWorkspace,
        companyName: primaryMembership?.name ?? company?.name,
        companyCurrency:
          primaryMembership?.billing_currency ??
          companyBillingCurrency(company),
        companyCountryCode: countryCodeOf(
          primaryMembership?.country ?? company?.country,
        ),
        entityName: activeMembership?.name,
        entityCurrency: office
          ? officeOwnerMembership?.billing_currency
          : activeMembership?.billing_currency,
        entityCountryCode: countryCodeOf(activeMembership?.country),
      }),
    [
      activeMembership?.billing_currency,
      activeMembership?.country,
      activeMembership?.name,
      company?.country,
      company?.billing_currency,
      company?.billing_currency_code,
      company?.name,
      isGlobalWorkspace,
      office,
      officeOwnerMembership?.billing_currency,
      primaryMembership?.billing_currency,
      primaryMembership?.country,
      primaryMembership?.name,
    ],
  );

  const canChooseEntity = canShowOrderingForBanner(
    access.isGlobalAdmin,
    getAdministeredEntityIds(access).length,
  );

  return {
    visible: Boolean(target.name) && (Boolean(office) || canChooseEntity),
    name: target.name,
    currency: target.currency,
    countryCode: target.countryCode,
  };
}
