import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { statusConfig } from "../utils";
import type { KitStatus } from "../types";
import KitPill from "./KitPill";

interface Props {
  status: KitStatus;
}

const KitStatusBadge = ({ status }: Props) => {
  const config = statusConfig[status];

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

export default KitStatusBadge;
