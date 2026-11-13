"use client";

import { memo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { HiDotsVertical } from "react-icons/hi";
import { Users, Info } from "lucide-react";
import { useShouldDisableActionItem } from "@/hooks/useShouldDisableActionItem";
import { IAssetRefreshList } from "@/types/assetRefresh";
import { useViewNavigation } from "@/hooks/useViewNavigation";
import { cn } from "@/lib/utils";

interface EquipmentsTableProps {
  onAssign: () => void;
  onRenew?: () => void;
  viewHref?: string;
  onDeviceRefreshAssign?: () => void;
  isDeviceRefresh?: boolean;
  deviceRefreshSelectedEquipment?:
    | IAssetRefreshList
    | IAssetRefreshList[]
    | undefined;
}

const EquipmentsTableActions: React.FC<EquipmentsTableProps> = memo(
  ({
    onAssign,
    viewHref,
    onDeviceRefreshAssign,
    isDeviceRefresh,
    deviceRefreshSelectedEquipment,
  }) => {
    const { hideAssign } = useShouldDisableActionItem();
    const [open, setOpen] = useState(false);
    const { view, isPending } = useViewNavigation();

    const handleClick = (action?: () => void) => {
      if (action) action();
      setOpen(false);
    };

    const handleViewEquipment = () => {
      if (!viewHref) {
        return;
      }
      view(viewHref);
      setOpen(false);
    };

    const canShowAssign =
      (!isDeviceRefresh && !hideAssign) ||
      (isDeviceRefresh &&
        (deviceRefreshSelectedEquipment === undefined ||
          !Array.isArray(deviceRefreshSelectedEquipment) ||
          deviceRefreshSelectedEquipment.length <= 1));

    const canShowView = !isDeviceRefresh && Boolean(viewHref);

    const hasAnyAction = canShowAssign || canShowView;

    if (!hasAnyAction) {
      return null;
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              disabled={isPending}
              data-testid="allequipmentstableaction-button"
            >
              <HiDotsVertical className="text-gray-500 text-xl" />
              <span className="sr-only">Open menu</span>
            </Button>
            {isPending ? (
              <span
                className={cn(
                  "pointer-events-none absolute inset-0 flex items-center justify-center",
                  "rounded-md bg-primary/80",
                )}
              >
                <Loader2 className="size-5 animate-spin text-fg-quaternary" />
              </span>
            ) : null}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-auto flex flex-col gap-y-5 text-sm">
          {!isDeviceRefresh && !hideAssign && (
            <ActionItem
              label="Assign"
              Icon={Users}
              onClick={() => handleClick(onAssign)}
            />
          )}

          {isDeviceRefresh &&
            (deviceRefreshSelectedEquipment === undefined ||
              !Array.isArray(deviceRefreshSelectedEquipment) ||
              deviceRefreshSelectedEquipment.length < 2) && (
              <ActionItem
                label="Assign"
                Icon={Users}
                onClick={() => handleClick(onDeviceRefreshAssign)}
              />
            )}

          {!isDeviceRefresh && (
            <ActionItem
              label="View equipment"
              Icon={Info}
              onClick={handleViewEquipment}
            />
          )}
        </PopoverContent>
      </Popover>
    );
  },
);

export default EquipmentsTableActions;

interface ActionItemProps {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  disabled?: boolean;
}

const ActionItem: React.FC<ActionItemProps> = ({ label, Icon, onClick }) => (
  <div
    className={`group flex gap-3 items-center cursor-pointer`}
    onClick={onClick}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </div>
);
