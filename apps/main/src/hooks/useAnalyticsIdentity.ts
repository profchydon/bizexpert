import {
  hasOptedOutAnalytics,
  identifyCompany,
  identifyUser,
  optInAnalytics,
  optOutAnalytics,
} from "@/lib/analytics";
import type { ICompany, IImpersonationSession, IUser } from "@/types/auth";
import { useEffect } from "react";

export function shouldSuppressAnalyticsIdentity(
  impersonation?: IImpersonationSession | null,
): boolean {
  return impersonation != null;
}

export function useAnalyticsIdentity(
  isAuth: boolean,
  user: IUser | null | undefined,
  company: ICompany | null | undefined,
  impersonation?: IImpersonationSession | null,
): void {
  const isImpersonating = shouldSuppressAnalyticsIdentity(impersonation);

  useEffect(() => {
    if (isImpersonating) {
      optOutAnalytics();
      return;
    }

    if (hasOptedOutAnalytics()) {
      optInAnalytics();
    }
  }, [
    isImpersonating,
    impersonation?.admin_id,
    impersonation?.company_id,
    impersonation?.expires_at,
  ]);

  useEffect(() => {
    if (isImpersonating) {
      return;
    }

    if (isAuth && user) {
      identifyUser(user);
    }
  }, [isImpersonating, isAuth, user?.id, user?.email, user?.role, user?.stage]);

  useEffect(() => {
    if (isImpersonating) {
      return;
    }

    if (isAuth && company) {
      identifyCompany(company);
    }
  }, [
    isImpersonating,
    isAuth,
    company?.id,
    company?.name,
    company?.industry,
    company?.size,
    company?.country?.name,
    company?.currency_code,
  ]);
}
