"use client";

import { useRef, useState } from "react";
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccountsClickOutside } from "../hooks/useAccountsClickOutside";
import type { SubsidiaryStatus } from "../types";
import { entityStatusFilterOptions } from "../utils/badgeTooltips";
import { AccountsFilterPanel } from "./AccountsFilterPanel";
import {
  accountsToolbarIconClass,
  accountsToolbarOutlineButtonClass,
} from "./accountsTableToolbarClasses";

interface Props {
  statuses: SubsidiaryStatus[];
  onChange: (statuses: SubsidiaryStatus[]) => void;
}

export function AccountsTableFilter({ statuses, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = statuses.length;

  useAccountsClickOutside({
    isEnabled: isOpen,
    onOutsideClick: () => setIsOpen(false),
    ref: containerRef,
  });

  return (
    <div ref={containerRef} className="relative shrink-0">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={accountsToolbarOutlineButtonClass}
        onMouseDown={(event) => {
          event.preventDefault();
          setIsOpen((open) => !open);
        }}
        data-testid="accountstablefilter-button"
      >
        <ListFilter className={cn(accountsToolbarIconClass, "text-gray-500")} />
        {activeCount > 0 ? `Filters (${activeCount})` : "Filters"}
      </Button>
      <AccountsFilterPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        groups={[
          {
            key: "status",
            label: "Status",
            options: entityStatusFilterOptions,
          },
        ]}
        values={{ status: statuses }}
        onApply={(next) => onChange((next.status ?? []) as SubsidiaryStatus[])}
      />
    </div>
  );
}
