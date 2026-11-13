"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import PageState from "@/components/PageState";
import { resolveLegacyRouteForNewFlow } from "@/config/orderFlowsLegacyRoutes";
import { useOrderFlowsUiUpdate } from "@/hooks/useOrderFlowsUiUpdate";

interface OrderFlowsNewRouteGuardProps {
  children: React.ReactNode;
}

const OrderFlowsNewRouteGuard: React.FC<OrderFlowsNewRouteGuardProps> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { enabled, resolved } = useOrderFlowsUiUpdate();

  useEffect(() => {
    if (!resolved || enabled) return;
    router.replace(resolveLegacyRouteForNewFlow(pathname));
  }, [enabled, pathname, resolved, router]);

  if (!resolved) {
    return <PageState isLoading isError={false} />;
  }

  if (!enabled) {
    return <PageState isLoading isError={false} />;
  }

  return <>{children}</>;
};

export default OrderFlowsNewRouteGuard;
