"use client";

import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import routes from "@/routes";
import { useLoginConfirmationMutation } from "@/api/baseQueries/authFlowApi/loginConfirmation";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useAppDispatch } from "@/store";
import { setEncryptAuth } from "@/store/slices/authSlice";
import { encryptAuthData } from "@/utils/encryption/encryptAuthData";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import Loader from "@/components/Loader";
import { clearClientAuthSession } from "@/utils/auth/clearClientAuthSession";
import { sanitizePostLoginRedirect } from "@/utils/auth/postLoginRedirect";
import { resolveOnboardingRoute } from "@/config/onboardingRoutes";
import { useNewOnboardingFlag } from "@/hooks/useNewOnboardingFlag";
import { IUser } from "@/types/auth";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import {
  resolveAccessContext,
  resolveDefaultDashboardRoute,
  shouldRedirectBasicUserToEmployeePortal,
} from "@/utils/auth/resolveAccessContext";

const redirectStorageKey = "post_login_redirect";

const consumeIntendedPath = () => {
  if (globalThis.window === undefined) return null;
  const intendedPath =
    globalThis.window.sessionStorage.getItem(redirectStorageKey);
  if (intendedPath) {
    globalThis.window.sessionStorage.removeItem(redirectStorageKey);
  }
  return intendedPath;
};

const Callback = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") as string;

  const router = useRouter();
  const { getEntityMemberships } = useAuthUserDetail();
  const [confirmedUser, setConfirmedUser] = useState<IUser | null>(null);
  const { enabled: isNewOnboardingEnabled, resolved: isNewOnboardingResolved } =
    useNewOnboardingFlag();

  const [loginConfirmation, loginConfirmationProps] =
    useLoginConfirmationMutation();

  const completeLogin = async (code: string) => {
    const { success, data } = await loginConfirmation({ code }).unwrap();

    if (success) {
      const { auth_token, user, company, entities } = data;

      clearClientAuthSession(dispatch, { preservePostLoginRedirect: true });
      dispatch(setSelectedEmployees([]));

      dispatch(
        setEncryptAuth(
          encryptAuthData({
            auth_token,
            user,
            company,
            entities,
          }),
        ),
      );

      displaySuccessMessage("Authentication Successful");
      setConfirmedUser(user);
    }
  };

  useEffect(() => {
    if (code) {
      completeLogin(code);
    }
    if (!code) {
      redirect(routes.LOGIN);
    }
  }, [code]);

  useEffect(() => {
    if (!confirmedUser || !isNewOnboardingResolved) return;

    const intendedPath = sanitizePostLoginRedirect(consumeIntendedPath());
    const onboardingRoute = resolveOnboardingRoute(
      confirmedUser.stage,
      isNewOnboardingEnabled,
    );

    if (onboardingRoute) {
      router.push(onboardingRoute);
      return;
    }

    if (intendedPath) {
      router.push(intendedPath);
      return;
    }

    const access = resolveAccessContext(confirmedUser, getEntityMemberships());

    if (shouldRedirectBasicUserToEmployeePortal(access)) {
      router.push(routes.EMPLOYEE);
      return;
    }

    router.push(resolveDefaultDashboardRoute(access));
  }, [confirmedUser, isNewOnboardingEnabled, isNewOnboardingResolved, router]);

  return (
    <div className="grid place-content-center h-screen">
      {code && loginConfirmationProps.isLoading && <Loader />}
    </div>
  );
};

export default Callback;
