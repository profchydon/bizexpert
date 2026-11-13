"use client";

import {
  BankNote02,
  HomeLine,
  LogOut01,
  Receipt,
  Settings01,
  User01,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import type { AccountMenuItem } from "./accountMenuConfig";
import type { useAccountSwitcher } from "./useAccountSwitcher";
import { WorkspaceSwitcherSection } from "./WorkspaceSwitcherSection";

const iconByName: Record<string, typeof User01> = {
  "View profile": User01,
  Profile: User01,
  "Go to admin": HomeLine,
  Transactions: BankNote02,
  Invoices: Receipt,
  Settings: Settings01,
  "Account management": HomeLine,
};

type WorkspaceSwitcherState = Pick<
  ReturnType<typeof useAccountSwitcher>,
  | "scopes"
  | "onSelectScope"
  | "switchingScopeId"
  | "isSwitchingWorkspace"
  | "canSwitch"
  | "hasMoreEntities"
  | "onLoadMoreEntities"
  | "isLoadingMoreEntities"
>;

interface Props {
  items: AccountMenuItem[];
  onSignOut: () => void;
  showWorkspaceSwitcher?: boolean;
  workspaceSwitcher?: WorkspaceSwitcherState;
}

export function AccountMenuItems({
  items,
  onSignOut,
  showWorkspaceSwitcher = false,
  workspaceSwitcher,
}: Props) {
  const { push } = useTransitionRouter();

  return (
    <Dropdown.Popover className="w-72 rounded-2xl bg-secondary_alt">
      <Dropdown.Menu
        selectionMode="none"
        className="rounded-t-2xl bg-primary shadow-xs ring-1 ring-secondary"
      >
        {items.map((item) => {
          const Icon = iconByName[item.name] ?? User01;
          return (
            <Dropdown.Item
              key={item.name}
              icon={Icon}
              onAction={() => push(item.link)}
            >
              {item.name}
            </Dropdown.Item>
          );
        })}

        {showWorkspaceSwitcher && workspaceSwitcher?.canSwitch ? (
          <Dropdown.Separator />
        ) : null}
      </Dropdown.Menu>

      {showWorkspaceSwitcher && workspaceSwitcher?.canSwitch ? (
        <WorkspaceSwitcherSection
          scopes={workspaceSwitcher.scopes}
          onSelectScope={workspaceSwitcher.onSelectScope}
          switchingScopeId={workspaceSwitcher.switchingScopeId}
          hasMore={workspaceSwitcher.hasMoreEntities}
          onLoadMore={workspaceSwitcher.onLoadMoreEntities}
          isLoadingMore={workspaceSwitcher.isLoadingMoreEntities}
        />
      ) : null}

      <div className="flex flex-col gap-3 p-3">
        <Button
          size="sm"
          color="secondary"
          iconLeading={LogOut01}
          className="w-full justify-center"
          onClick={onSignOut}
          data-testid="accountmenuitems-button"
        >
          Sign out
        </Button>
      </div>
    </Dropdown.Popover>
  );
}
