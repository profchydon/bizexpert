"use client";

import React from "react";
import PageState from "@/components/PageState";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FEATURE_FLAGS } from "@/config/featureFlags";
import useViewOrderController from "./useViewOrderController";
import ViewOrderLegacy from "./ViewOrderLegacy";
import ViewOrderV2 from "./ViewOrderV2";
import ViewOrderModals from "./ViewOrderModals";

const ViewOrder = () => {
  const controller = useViewOrderController();
  const { enabled, resolved } = useFeatureFlag(
    FEATURE_FLAGS.ORDER_SCREEN_UI_UPDATE,
  );

  return (
    <PageState
      isLoading={controller.isLoading || !resolved}
      isError={controller.isError}
    >
      {enabled ? (
        <ViewOrderV2 controller={controller} />
      ) : (
        <ViewOrderLegacy controller={controller} />
      )}
      <ViewOrderModals controller={controller} />
    </PageState>
  );
};

export default ViewOrder;
