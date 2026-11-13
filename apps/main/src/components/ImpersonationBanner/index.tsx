"use client";

import config from "@/config/config";
import { useImpersonationEndMutation } from "@/api/baseQueries/authFlowApi/impersonationEnd";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store";
import { optInAnalytics, track } from "@/lib/analytics";
import { clearClientAuthSession } from "@/utils/auth/clearClientAuthSession";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

const ImpersonationBanner = () => {
  const dispatch = useAppDispatch();
  const { getUserDetails, getCompanyDetails, getImpersonationDetails } =
    useAuthUserDetail();
  const [impersonationEnd] = useImpersonationEndMutation();
  const [isExiting, setIsExiting] = useState(false);

  const impersonation = getImpersonationDetails();
  const user = getUserDetails();
  const company = getCompanyDetails();

  if (!impersonation) {
    return null;
  }

  const handleExit = async () => {
    setIsExiting(true);

    optInAnalytics();
    track("Impersonation Ended");

    try {
      await impersonationEnd({ impersonation }).unwrap();
    } catch {
    } finally {
      clearClientAuthSession(dispatch);

      if (typeof window !== "undefined") {
        window.close();

        const adminUrl = config.ADMIN_APP_URL;
        if (adminUrl) {
          window.location.href = adminUrl;
        }
      }
    }
  };

  const userName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      data-testid="impersonation-banner"
    >
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <p>
            You are viewing{" "}
            <span className="font-semibold">{company?.name}</span> as{" "}
            <span className="font-semibold">{userName}</span>. Impersonated by{" "}
            <span className="font-semibold">{impersonation.admin_name}</span>.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-amber-300 bg-white text-amber-950 hover:bg-amber-100"
          onClick={() => void handleExit()}
          disabled={isExiting}
          data-testid="impersonationbanner-button"
        >
          Exit impersonation
        </Button>
      </div>
    </div>
  );
};

export default ImpersonationBanner;
