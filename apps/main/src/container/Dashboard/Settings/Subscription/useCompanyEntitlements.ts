"use client";

import { useGetSubscriptionEntitlementsQuery } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContractApi";
import type { SubscriptionEntitlement } from "@/api/baseQueries/companiesApi/subscriptionsApi/subscriptionContract";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import {
  countedLimit,
  featureOn,
  findEntitlement,
  type CountedLimit,
} from "./entitlementAccess";

export function useCompanyEntitlements() {
  const { getCompanyDetails } = useAuthUserDetail();
  const companyId = getCompanyDetails()?.id;
  const query = useGetSubscriptionEntitlementsQuery(
    { companyId },
    { skip: !companyId },
  );
  const items = query.data?.data?.entitlements;
  const pending = !companyId || query.isLoading || query.isUninitialized;
  const failed = query.isError;

  return {
    items,
    ready: !pending && (query.isSuccess || failed),
    failed,
    find(code: string): SubscriptionEntitlement | null {
      return findEntitlement(items, code);
    },
    limit(code: string): CountedLimit | null {
      return countedLimit(findEntitlement(items, code));
    },
    on(code: string): boolean {
      if (failed) return true;
      if (!query.isSuccess) return false;
      return featureOn(findEntitlement(items, code));
    },
  };
}

export function useEntitlementOn(code: string) {
  const entitlements = useCompanyEntitlements();
  return {
    ready: entitlements.ready,
    on: entitlements.ready ? entitlements.on(code) : false,
  };
}
