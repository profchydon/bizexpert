"use client";

import { ChevronDown, User01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { cn } from "@/lib/utils";
import { AccountMenuItems } from "./AccountMenuItems";
import type { AccountMenuItem } from "./accountMenuConfig";
import {
  accountMenuTriggerBaseClass,
  accountMenuTriggerClass,
} from "./accountMenuConfig";
import { useAccountSwitcher } from "./useAccountSwitcher";
import { flagByCode } from "./flagByCode";

interface Props {
  items: AccountMenuItem[];
  onSignOut: () => void;
  isPending?: boolean;
  triggerTestId?: string;
  compactTrigger?: boolean;
  showWorkspaceSwitcher?: boolean;
}

export function AccountMenuPanel({
  items,
  onSignOut,
  isPending = false,
  triggerTestId = "navsetting-button",
  compactTrigger = false,
  showWorkspaceSwitcher = false,
}: Props) {
  const workspaceSwitcher = useAccountSwitcher(showWorkspaceSwitcher);
  const Flag = flagByCode(workspaceSwitcher.activeScope.countryCode);

  return (
    <Dropdown.Root>
      {compactTrigger ? (
        <Button
          size="sm"
          color="secondary"
          aria-label="Open account menu"
          isDisabled={isPending || workspaceSwitcher.isSwitchingWorkspace}
          iconLeading={User01}
          className="size-10 data-icon-only:p-2 lg:hidden"
          data-testid="accountmenupanel-button"
        />
      ) : (
        <Button
          size="sm"
          color="secondary"
          aria-label={`Account menu, current workspace ${workspaceSwitcher.activeScope.label}`}
          isDisabled={isPending || workspaceSwitcher.isSwitchingWorkspace}
          iconLeading={
            showWorkspaceSwitcher && Flag ? (
              <Flag className="size-5 shrink-0 rounded-full object-cover" />
            ) : undefined
          }
          iconTrailing={(props) => (
            <ChevronDown
              data-icon="trailing"
              {...props}
              className="size-4! stroke-[2.25px]!"
            />
          )}
          className={cn(
            accountMenuTriggerBaseClass,
            showWorkspaceSwitcher
              ? "ml-1 hidden max-w-60 lg:flex"
              : accountMenuTriggerClass,
          )}
          data-testid="accountmenupanel-button-2"
        >
          {showWorkspaceSwitcher ? (
            <span
              title={workspaceSwitcher.activeScope.label}
              className="inline-block max-w-[68px] truncate align-middle"
            >
              {workspaceSwitcher.activeScope.label}
            </span>
          ) : (
            "Account"
          )}
        </Button>
      )}

      <AccountMenuItems
        items={items}
        onSignOut={onSignOut}
        showWorkspaceSwitcher={showWorkspaceSwitcher}
        workspaceSwitcher={workspaceSwitcher}
      />
    </Dropdown.Root>
  );
}

export {
  adminAccountMenuItems,
  adminEmployeeAccountMenuItems,
  buildEmployeeAccountMenuItems,
  employeeAccountMenuItems,
  filterAccountMenuItems,
  accountMenuTriggerClass,
  accountMenuTriggerBaseClass,
} from "./accountMenuConfig";

export type { AccountMenuItem } from "./accountMenuConfig";
