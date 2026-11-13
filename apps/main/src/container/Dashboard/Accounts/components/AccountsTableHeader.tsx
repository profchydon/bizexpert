import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/base/badges/badges";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  accountsToolbarIconClass,
  accountsToolbarSearchClass,
} from "./accountsTableToolbarClasses";

interface Props {
  title: string;
  count: number;
  countTooltip: string;
  query: string;
  onQueryChange: (value: string) => void;
  searchPlaceholder: string;
  searchAriaLabel: string;
  filter?: ReactNode;
  action?: ReactNode;
}

export function AccountsTableHeader({
  title,
  count,
  countTooltip,
  query,
  onQueryChange,
  searchPlaceholder,
  searchAriaLabel,
  filter,
  action,
}: Props) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex shrink-0 items-center gap-2">
        <h2 className="whitespace-nowrap text-base font-semibold text-gray-900">
          {title}
        </h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default">
                <Badge color="gray" size="sm">
                  {count.toLocaleString("en-US")}
                </Badge>
              </span>
            </TooltipTrigger>
            <TooltipContent>{countTooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex w-full min-w-0 flex-row flex-nowrap items-center justify-end gap-3">
        <div className="relative w-full sm:w-80 sm:shrink-0">
          <Search
            className={cn(
              "pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400",
              accountsToolbarIconClass,
            )}
          />
          <Input
            aria-label={searchAriaLabel}
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className={accountsToolbarSearchClass}
            data-testid="accountstableheader-input"
          />
        </div>
        {filter}
        {action}
      </div>
    </div>
  );
}
