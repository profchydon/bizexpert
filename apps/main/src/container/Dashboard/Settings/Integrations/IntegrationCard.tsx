import React from "react";
import { check_icon_green } from "@/assets/icons";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { categoryBadgesFor } from "./integrationCategories";
import { liveIntegrationSyncCopy } from "./liveIntegrationSyncCopy";
import type { I_RsSyncStatus } from "@/types/integrations";

interface Props {
  title: string;
  description: string;
  icon: any;
  id: string;
  isSetup: "Inactive" | "Active";
  isConfigure: boolean;
  component?: (isOpen: boolean, onClose: () => void) => React.ReactNode;
  slug: string;
  code: string;
  isLive?: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  categories?: string[];
  rsSyncStatus?: I_RsSyncStatus | null;
  rsSyncError?: string | null;
  onRetry?: () => void;
  isRetrying?: boolean;
}

const IntegrationCard: React.FC<Props> = ({
  description,
  id,
  icon,
  title,
  isSetup,
  isConfigure,
  component,
  slug,
  code,
  isLive,
  isOpen,
  onOpen,
  onClose,
  categories,
  rsSyncStatus,
  rsSyncError,
  onRetry,
  isRetrying,
}) => {
  const badges = categoryBadgesFor(categories);
  const syncCopy = liveIntegrationSyncCopy(rsSyncStatus, rsSyncError);
  const isPending = Boolean(syncCopy.banner);

  return (
    <>
      <div
        className={cn(
          "relative flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5",
          (!component || (isSetup === "Inactive" && !isLive)) &&
            "opacity-50 pointer-events-none",
        )}
      >
        <div className="flex items-center gap-3 pr-7">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-sm font-semibold text-gray-700">
            <Image src={icon} alt={title} className="size-6" />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {isLive && !syncCopy.isFailed && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="absolute right-4 top-4 cursor-default">
                <Image
                  src={check_icon_green}
                  alt="connected"
                  className="size-5"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{syncCopy.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <p className="min-h-[60px] text-sm text-gray-600">{description}</p>
        {isLive && isPending && (
          <div
            className={cn(
              "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-xs",
              syncCopy.isFailed
                ? "bg-red-50 text-red-800"
                : "bg-amber-50 text-amber-800",
            )}
          >
            <span>{syncCopy.banner}</span>
            {onRetry && (
              <Button
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={onRetry}
                disabled={isRetrying}
                data-testid="integrationcard-button"
              >
                Retry
              </Button>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2">
            {isSetup === "Inactive" && !isLive && (
              <Button
                variant="outline"
                className="h-9 rounded-md bg-white px-3 text-sm font-semibold text-gray-700 shadow-sm"
                onClick={onOpen}
                data-testid="integrationcard-button-2"
              >
                Manage
              </Button>
            )}

            {isSetup === "Active" && !isLive && (
              <Button
                className="h-9 rounded-md bg-primary-600 px-3 text-sm font-semibold text-white"
                onClick={onOpen}
                data-testid="integrationcard-button-3"
              >
                Setup
              </Button>
            )}
            {isSetup === "Active" && isLive && (
              <Button
                variant="outline"
                className="h-9 rounded-md bg-white px-3 text-sm font-semibold text-gray-700 shadow-sm"
                onClick={onOpen}
                data-testid="integrationcard-button-4"
              >
                View Details
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            className="flex size-9 items-center justify-center rounded-md bg-white p-0 text-gray-700 shadow-sm"
            onClick={onOpen}
            data-testid="integrationcard-button-5"
          >
            <ArrowUpRight className="size-4" />
          </Button>
        </div>
      </div>

      {isOpen && component && component(isOpen, onClose)}
    </>
  );
};

export default IntegrationCard;
