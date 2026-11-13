"use client";

import { useEffect, useRef } from "react";
import PageState from "@/components/PageState";
import { catalogPolicyBlockedHref } from "@/config/catalogEntitlementRoutes";
import { useEntitlementOn } from "@/container/Dashboard/Settings/Subscription/useCompanyEntitlements";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import React from "react";

const CatalogAccessWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const catalog = useEntitlementOn("catalog_limit");
  const { activeEntityId } = useActiveWorkspace();
  const { replace } = useTransitionRouter();
  const blocked = catalog.ready && !catalog.on;
  const sentBack = useRef(false);

  useEffect(() => {
    if (!blocked || sentBack.current) return;
    sentBack.current = true;
    replace(catalogPolicyBlockedHref(activeEntityId));
  }, [activeEntityId, blocked, replace]);

  if (!catalog.ready || blocked) {
    return <PageState isLoading isError={false} />;
  }

  return <>{children}</>;
};

export default CatalogAccessWrapper;
