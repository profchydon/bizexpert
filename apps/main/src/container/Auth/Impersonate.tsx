"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import routes from "@/routes";
import { useImpersonationConfirmMutation } from "@/api/baseQueries/authFlowApi/impersonationConfirm";
import displayErrorMessage from "@/utils/displayErrorMessage";
import { useAppDispatch } from "@/store";
import { setEncryptAuth } from "@/store/slices/authSlice";
import { encryptAuthData } from "@/utils/encryption/encryptAuthData";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import Loader from "@/components/Loader";
import { track } from "@/lib/analytics";
import { clearClientAuthSession } from "@/utils/auth/clearClientAuthSession";

const Impersonate = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") as string | null;
  const router = useRouter();

  const [impersonationConfirm, impersonationConfirmProps] =
    useImpersonationConfirmMutation();

  useEffect(() => {
    if (!code) {
      displayErrorMessage("Invalid impersonation link.");
      router.replace(routes.LOGIN);
      return;
    }

    const completeImpersonation = async () => {
      try {
        const { success, data } = await impersonationConfirm({ code }).unwrap();

        if (!success) {
          displayErrorMessage("Unable to complete impersonation login.");
          router.replace(routes.LOGIN);
          return;
        }

        const { auth_token, user, company, impersonation } = data;

        track("Impersonation Started", {
          admin_id: impersonation.admin_id,
          target_company_id: impersonation.company_id,
        });

        clearClientAuthSession(dispatch);
        dispatch(setSelectedEmployees([]));

        dispatch(
          setEncryptAuth(
            encryptAuthData({
              auth_token,
              user,
              company,
              impersonation,
            }),
          ),
        );

        router.replace(routes.DASHBOARD);
      } catch {
        displayErrorMessage("Unable to complete impersonation login.");
        router.replace(routes.LOGIN);
      }
    };

    void completeImpersonation();
  }, [code, dispatch, impersonationConfirm, router]);

  if (code && impersonationConfirmProps.isLoading) {
    return <Loader />;
  }

  return null;
};

export default Impersonate;
