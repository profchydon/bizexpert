"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { slug as integrationIcons } from "@/container/Dashboard/Settings/Integrations/integrationImages";
import { isFinchIntegration } from "@/container/Dashboard/Settings/Integrations/liveIntegrationKey";
import type { I_LiveIntegrations } from "@/types/integrations";
import { HrisConnectMoreButton } from "./HrisConnectMoreButton";
import { formatLastSyncAt, formatNextSyncIn } from "./hrisSyncSchedule";

type Props = {
  integrations: I_LiveIntegrations[];
  onManage: (slug: string) => void;
};

export function HrisConnectedList({ integrations, onManage }: Readonly<Props>) {
  return (
    <div
      className="flex flex-col gap-4 px-6 pb-6 pt-6"
      data-testid="hris-connected-list"
    >
      <div className="flex items-center justify-end">
        <HrisConnectMoreButton />
      </div>
      {integrations.map((integration) => {
        const matchedIcon =
          integrationIcons.find(
            (iconItem) => iconItem.slug === integration?.integration?.slug,
          )?.icon || "";
        const statusLabel =
          integration?.status === "Inactive" ? "Disconnected" : "Connected";
        const canManage = isFinchIntegration(integration);
        const slug = integration?.integration?.slug;

        return (
          <Card
            key={integration?.id}
            className={cn(
              "w-full rounded-xl border border-gray-200 bg-white shadow-sm",
              !canManage && "opacity-60",
            )}
          >
            <CardContent className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-start gap-3">
                {matchedIcon ? (
                  <Image
                    src={matchedIcon}
                    alt={integration?.integration?.name}
                    width={40}
                    height={40}
                    className="h-10 w-10"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-100" />
                )}
                <div className="space-y-1">
                  <div className="flex flex-row items-center space-x-3 text-base font-semibold text-gray-900">
                    <p>{integration?.integration?.name}</p>
                    <Badge
                      variant={statusLabel === "Connected" ? "success" : "gray"}
                      className="text-[10px]"
                    >
                      {statusLabel}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last sync: {formatLastSyncAt(integration?.last_sync_at)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Next sync in:{" "}
                    {formatNextSyncIn(
                      integration?.last_sync_at,
                      integration?.configuration?.sync_frequency,
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="h-9 min-w-[110px] text-sm"
                onClick={() => {
                  if (slug) {
                    onManage(slug);
                  }
                }}
                disabled={!canManage}
                data-testid="hrisconnectedlist-button"
              >
                Manage
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
