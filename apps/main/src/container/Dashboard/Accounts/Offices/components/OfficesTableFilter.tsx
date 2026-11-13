"use client";

import { useRef, useState } from "react";
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccountsClickOutside } from "../../hooks/useAccountsClickOutside";
import type { Office } from "../../types";
import { AccountsFilterPanel } from "../../components/AccountsFilterPanel";
import {
  accountsToolbarIconClass,
  accountsToolbarOutlineButtonClass,
} from "../../components/accountsTableToolbarClasses";

const typeGroup = [
  {
    key: "type",
    label: "Type",
    options: [
      { id: "Physical", label: "Physical" },
      { id: "Remote", label: "Remote" },
    ],
  },
];

interface Props {
  types: Office["type"][];
  onChange: (types: Office["type"][]) => void;
}

export function OfficesTableFilter({ types, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = types.length;

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
        data-testid="officestablefilter-button"
      >
        <ListFilter className={cn(accountsToolbarIconClass, "text-gray-500")} />
        {activeCount > 0 ? `Filters (${activeCount})` : "Filters"}
      </Button>
      <AccountsFilterPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        groups={typeGroup}
        values={{ type: types }}
        onApply={(next) => onChange((next.type ?? []) as Office["type"][])}
      />
    </div>
  );
}
