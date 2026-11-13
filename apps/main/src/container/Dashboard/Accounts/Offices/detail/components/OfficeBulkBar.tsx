import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { OfficeBulkAction } from "../../hooks/useOfficeBulkActions";

interface Props {
  count: number;
  actions: OfficeBulkAction[];
  onClear: () => void;
}

function ActionButton({ action }: { action: OfficeBulkAction }) {
  const button = (
    <Button
      variant="outline"
      size="sm"
      disabled={action.disabled}
      onClick={action.onClick}
      data-testid="officebulkbar-button"
    >
      <action.icon className="mr-2 size-4" />
      {action.label}
    </Button>
  );

  if (!action.disabled || !action.disabledReason) return button;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-not-allowed">{button}</span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {action.disabledReason}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function OfficeBulkBar({ count, actions, onClear }: Props) {
  const disabledNotice = actions.find(
    (action) => action.disabled && action.disabledReason,
  )?.disabledReason;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-100 bg-primary-50 px-5 py-2.5">
      <span className="text-sm font-semibold text-gray-900">
        {count} selected
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        {actions.map((action) => (
          <ActionButton key={action.label} action={action} />
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          data-testid="officebulkbar-button-2"
        >
          <X className="mr-2 size-4" />
          Clear
        </Button>
      </div>
      {disabledNotice ? (
        <p className="basis-full text-xs text-gray-600">{disabledNotice}</p>
      ) : null}
    </div>
  );
}
