import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleHelp } from "lucide-react";

interface Props {
  tooltipTrigger?: React.ReactNode;
  content: React.ReactNode | string;
  width?: string;
}
const InfoTooltip: React.FC<Props> = ({ content, tooltipTrigger, width }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {tooltipTrigger ?? <CircleHelp className="text-gray-400 h-5" />}
        </TooltipTrigger>
        <TooltipContent style={{ width: width ?? "362px" }}>
          <div>{content}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
