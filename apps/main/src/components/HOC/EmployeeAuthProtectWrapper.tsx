"use client";

import { resolveOnboardingRoute } from "@/config/onboardingRoutes";
import { useNewOnboardingFlag } from "@/hooks/useNewOnboardingFlag";
import { useAnalyticsIdentity } from "@/hooks/useAnalyticsIdentity";
import routes from "@/routes";
import { useAppDispatch, useAppSelector } from "@/store";
import { unsetAuth } from "@/store/slices/authSlice";
import { resetOnboardingData } from "@/store/slices/onboardingSlice";
import { sanitizePostLoginRedirect } from "@/utils/auth/postLoginRedirect";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const redirectStorageKey = "post_login_redirect";

const EmployeeAuthProtectWrapper: React.FC<React.PropsWithChildren> = ({
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
    getImpersonationDetails,
  } = useAuthUserDetail();
  const user = getUserDetails();
  const isAuth = isLoggedIn();
  const company = getCompanyDetails();
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
    if (!isAuth || !user || !isNewOnboardingResolved) return;

    const onboardingRoute = resolveOnboardingRoute(
      user.stage,
      isNewOnboardingEnabled,
    );
    if (onboardingRoute) {
      router.push(onboardingRoute);
    }
  }, [isAuth, user, isNewOnboardingResolved, isNewOnboardingEnabled]);

  useEffect(() => {
    if (onBoardingCompany && company?.id !== onBoardingCompany?.id) {
      dispatch(resetOnboardingData());
      dispatch(unsetAuth());
    }
  }, [company?.id, onBoardingCompany?.id]);

  return isMounted && isAuth && user?.stage === "Completed" && children;
};

export default EmployeeAuthProtectWrapper;
