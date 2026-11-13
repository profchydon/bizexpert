import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";

interface InactiveCellProps {
  label: string;
  tooltip: string;
}

const InactiveCell: React.FC<InactiveCellProps> = ({ label, tooltip }) => {
  return (
    <Tooltip title={tooltip} placement="top">
      <TooltipTrigger className="w-full cursor-default">
        <span className="flex h-9 w-full items-center truncate rounded-lg bg-secondary px-3 text-sm text-quaternary">
          {label}
        </span>
      </TooltipTrigger>
    </Tooltip>
  );
};

export default InactiveCell;
