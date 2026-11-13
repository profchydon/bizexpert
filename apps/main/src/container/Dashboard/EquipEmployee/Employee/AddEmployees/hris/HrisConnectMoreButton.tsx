"use client";

import { Button } from "@/components/ui/button";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import routes from "@/routes";

export function HrisConnectMoreButton() {
  const { push, isPending } = useTransitionRouter();

  return (
    <Button
      variant="outline"
      className="h-9 text-sm"
      isLoading={isPending}
      onClick={() => push(routes.SETTINGS_INTEGRATIONS)}
      data-testid="hrisconnectmorebutton-button"
    >
      Connect more
    </Button>
  );
}
