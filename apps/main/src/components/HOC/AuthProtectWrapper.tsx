"use client";

import { resolveOnboardingRoute } from "@/config/onboardingRoutes";
import { useNewOnboardingFlag } from "@/hooks/useNewOnboardingFlag";
import { useAnalyticsIdentity } from "@/hooks/useAnalyticsIdentity";
import { trackActivationStage } from "@/lib/activationAnalytics";
import routes from "@/routes";
import { useAppDispatch, useAppSelector } from "@/store";
import { unsetAuth } from "@/store/slices/authSlice";
import { resetOnboardingData } from "@/store/slices/onboardingSlice";
import { sanitizePostLoginRedirect } from "@/utils/auth/postLoginRedirect";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import {
  resolveAccessContext,
  shouldRedirectBasicUserToEmployeePortal,
} from "@/utils/auth/resolveAccessContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const redirectStorageKey = "post_login_redirect";

const AuthProtectWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isMounted, setIsMounted] = useState(false);

  const onBoardingCompany = useAppSelector(
    (state) => state.persistedReducers.onboarding.company,
  );
  const {
    isLoggedIn,
    getUserDetails,
    getCompanyDetails,
    getEntityMemberships,
    getImpersonationDetails,
  } = useAuthUserDetail();
  const user = getUserDetails();
  const isAuth = isLoggedIn();
  const company = getCompanyDetails();
  const access = resolveAccessContext(user, getEntityMemberships());
  const impersonation = getImpersonationDetails();
  const { enabled: isNewOnboardingEnabled, resolved: isNewOnboardingResolved } =
    useNewOnboardingFlag();

  useAnalyticsIdentity(isAuth, user, company, impersonation);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuth) {
      if (globalThis.window !== undefined) {
        const intendedPath = sanitizePostLoginRedirect(
          `${globalThis.window.location.pathname}${globalThis.window.location.search}`,
        );
        if (intendedPath) {
          globalThis.window.sessionStorage.setItem(
            redirectStorageKey,
            intendedPath,
          );
        }
      }
      router.push(routes.ONBOARDING);
    }
  }, [isAuth]);

  useEffect(() => {
    if (!isAuth || !user) return;

    const access = resolveAccessContext(user, getEntityMemberships());

    if (shouldRedirectBasicUserToEmployeePortal(access)) {
      router.push(routes.EMPLOYEE);
      return;
    }

    if (!isNewOnboardingResolved) return;

    const onboardingRoute = resolveOnboardingRoute(
      user.stage,
      isNewOnboardingEnabled,
    );
    if (onboardingRoute) {
      router.push(onboardingRoute);
    }
  }, [isAuth, isNewOnboardingEnabled, isNewOnboardingResolved, router, user]);

  useEffect(() => {
    if (!isAuth || !user?.stage) {
      return;
    }

    if (
      user.stage === "Verification" ||
      user.stage === "Onboarding" ||
      user.stage === "Company Information" ||
      user.stage === "Completed"
    ) {
      trackActivationStage(user.stage);
    }
  }, [isAuth, user?.stage]);

  useEffect(() => {
    if (onBoardingCompany && company?.id !== onBoardingCompany?.id) {
      dispatch(resetOnboardingData());
      dispatch(unsetAuth());
    }
  }, [company?.id, onBoardingCompany?.id]);

  return (
    isMounted &&
    isAuth &&
    user?.stage === "Completed" &&
    access.canAccessDashboard &&
    children
  );
};

export default AuthProtectWrapper;
