"use client";

import { Edit01, Eye, LogOut01, Package } from "@untitledui/icons";
import { Loader2 } from "lucide-react";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { useViewNavigation } from "@/hooks/useViewNavigation";
import { cx } from "@/utils/cx";

type Props = {
  viewHref: string;
  isArchived: boolean;
  canEquip: boolean;
  canOffboard: boolean;
  isEquipLoading?: boolean;
  isOffboardLoading?: boolean;
  onEdit: () => void;
  onEquip: () => void;
  onOffboard: () => void;
};

const menuSpinner = (
  <Loader2
    aria-hidden="true"
    className="size-4 shrink-0 animate-spin text-fg-quaternary"
  />
);

const EmployeeRowActions = ({
  viewHref,
  isArchived,
  canEquip,
  canOffboard,
  isEquipLoading = false,
  isOffboardLoading = false,
  onEdit,
  onEquip,
  onOffboard,
}: Props) => {
  const { view, isPending: isViewLoading } = useViewNavigation();
  const isNavigating = isViewLoading || isEquipLoading || isOffboardLoading;

  return (
    <div className="relative justify-self-end">
      <Dropdown.Root>
        <Dropdown.DotsButton isDisabled={isNavigating} />
        <Dropdown.Popover className="w-48">
          <Dropdown.Menu selectionMode="none">
            <Dropdown.Item
              icon={isViewLoading ? undefined : Eye}
              leading={isViewLoading ? menuSpinner : undefined}
              label="View"
              isDisabled={isNavigating && !isViewLoading}
              onAction={() => view(viewHref)}
            />
            {!isArchived && (
              <Dropdown.Item
                icon={Edit01}
                label="Edit"
                isDisabled={isNavigating}
                onAction={onEdit}
              />
            )}
            {!isArchived && (
              <>
                <Dropdown.Separator />
                <Dropdown.Item
                  icon={isEquipLoading ? undefined : Package}
                  leading={isEquipLoading ? menuSpinner : undefined}
                  label="Equip Employee"
                  isDisabled={!canEquip || isNavigating}
                  onAction={canEquip && !isNavigating ? onEquip : undefined}
                />
                <Dropdown.Item
                  icon={isOffboardLoading ? undefined : LogOut01}
                  leading={isOffboardLoading ? menuSpinner : undefined}
                  label="Off-board Employee"
                  isDisabled={!canOffboard || isNavigating}
                  onAction={
                    canOffboard && !isNavigating ? onOffboard : undefined
                  }
                />
              </>
            )}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown.Root>
      {isNavigating ? (
        <span
          className={cx(
            "pointer-events-none absolute inset-0 flex items-center justify-center",
            "rounded-md bg-primary/80",
          )}
        >
          <Loader2 className="size-5 animate-spin text-fg-quaternary" />
        </span>
      ) : null}
    </div>
  );
};

export default EmployeeRowActions;
