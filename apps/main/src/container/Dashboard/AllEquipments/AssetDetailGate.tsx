"use client";

import { useEffect, useRef } from "react";
import PageState from "@/components/PageState";
import { useEntitlementOn } from "@/container/Dashboard/Settings/Subscription/useCompanyEntitlements";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { assetDetailUpgradeHref } from "./assetDetailUpgrade";
import ViewEquipment from "./ViewEquipment";

export default function AssetDetailGate() {
  const access = useEntitlementOn("asset_detail");
  const { replace } = useTransitionRouter();
  const blocked = access.ready && !access.on;
  const sentBack = useRef(false);

  useEffect(() => {
    if (!blocked || sentBack.current) return;
    sentBack.current = true;
    replace(assetDetailUpgradeHref());
  }, [blocked, replace]);

  if (!access.ready || blocked) {
    return <PageState isLoading isError={false} />;
  }

  return <ViewEquipment />;
}
