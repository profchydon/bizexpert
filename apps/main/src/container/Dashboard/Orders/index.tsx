"use client";

import React from "react";
import PageState from "@/components/PageState";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FEATURE_FLAGS } from "@/config/featureFlags";
import OrdersLegacy from "./OrdersLegacy";
import OrdersV2 from "./v2/OrdersV2";

const Orders = () => {
  const { enabled, resolved } = useFeatureFlag(
    FEATURE_FLAGS.ORDER_SCREEN_UI_UPDATE,
  );

  return (
    <PageState isLoading={!resolved} isError={false}>
      {enabled ? <OrdersV2 /> : <OrdersLegacy />}
    </PageState>
  );
};

export default Orders;
