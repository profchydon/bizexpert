import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FulfillmentMode } from "../types";
import { fulfillmentConfig, getKitFulfillmentMode } from "../utils";
import KitPill from "./KitPill";

interface Props {
  mode: FulfillmentMode | null | undefined;
}

const FulfillmentBadge = ({ mode }: Props) => {
  const config = fulfillmentConfig[getKitFulfillmentMode(mode)];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <KitPill tone={config.tone}>{config.label}</KitPill>
          </span>
        </TooltipTrigger>
        <TooltipContent>{config.tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FulfillmentBadge;
