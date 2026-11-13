"use client";

import { useEffect } from "react";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useSearchParams } from "next/navigation";
import PageState from "@/components/PageState";
import {
  buildDeviceRefreshMarketplaceHref,
  shouldBlockAssignmentFlowForDeviceRefresh,
} from "@/utils/isDeviceRefreshContext";

const DeviceRefreshFlowRedirect = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { replace } = useTransitionRouter();
  const searchParams = useSearchParams();
  const shouldRedirect =
    shouldBlockAssignmentFlowForDeviceRefresh(searchParams);

  useEffect(() => {
    if (!shouldRedirect) return;
    replace(buildDeviceRefreshMarketplaceHref(searchParams));
  }, [replace, searchParams, shouldRedirect]);

  if (shouldRedirect) {
    return <PageState isLoading isError={false} />;
  }

  return <>{children}</>;
};

export default DeviceRefreshFlowRedirect;
