"use client";

import PageState from "@/components/PageState";
import { FEATURE_FLAGS } from "@/config/featureFlags";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import StoragePage from "./Remote/StoragePage";
import StorageLegacy from "./StorageLegacy";

const Storage = () => {
  const { enabled, resolved } = useFeatureFlag(FEATURE_FLAGS.REMOTE_STORAGE);

  return (
    <PageState isLoading={!resolved} isError={false}>
      {enabled ? <StoragePage /> : <StorageLegacy />}
    </PageState>
  );
};

export default Storage;
