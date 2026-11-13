"use client";

import { useEffect } from "react";
import PageState from "@/components/PageState";
import { FEATURE_FLAGS } from "@/config/featureFlags";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import routes from "@/routes";

interface StorageRemoteGateProps {
  children: React.ReactNode;
  fallback?: string;
}

const StorageRemoteGate = ({
  children,
  fallback = routes.STORAGE,
}: StorageRemoteGateProps) => {
  const { push } = useTransitionRouter();
  const { enabled, resolved } = useFeatureFlag(FEATURE_FLAGS.REMOTE_STORAGE);

  useEffect(() => {
    if (!resolved || enabled) return;
    push(fallback);
  }, [enabled, fallback, push, resolved]);

  if (!resolved) {
    return <PageState isLoading isError={false} />;
  }

  if (!enabled) {
    return <PageState isLoading isError={false} />;
  }

  return <>{children}</>;
};

export default StorageRemoteGate;
