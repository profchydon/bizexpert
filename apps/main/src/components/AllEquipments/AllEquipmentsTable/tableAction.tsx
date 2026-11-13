"use client";

import { memo } from "react";
import { Loader2, ScanEye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { HiDotsVertical } from "react-icons/hi";
import CustomTooltip from "@/components/CustomTooltip";
import { usePathname } from "next/navigation";
import routes from "@/routes";
import { equipmentViewHref } from "@/container/Dashboard/AllEquipments/assetDetailUpgrade";
import { useEntitlementOn } from "@/container/Dashboard/Settings/Subscription/useCompanyEntitlements";
import { useViewNavigation } from "@/hooks/useViewNavigation";
import { cn } from "@/lib/utils";
import ActionItem from "@/components/Offboarding/ActionItem";
import { DeviceRefreshActionType } from "@/types/offboarding";
import { useAppSelector } from "@/store";
import { IAssetRefreshList } from "@/types/assetRefresh";
import {
  isBulkActionEligible,
  normalizeEquipmentStatusKey,
} from "../equipmentBulkActionEligibility";
import { EquipmentTableActionMenuItems } from "./EquipmentTableActionMenuItems";
interface OffboardAsset {
  id: string;
  actionType?: "Transfer" | "Store" | "Sale";
}

interface AllEquipmentsTableActionsProps {
  item: { id: string; assignee?: string; status?: string; country: string };
  onTransferEquipment: () => void;
  onStoreEquipment?: () => void;
  onSellEquipment?: () => void;
  viewHref?: string;
  onBeforeViewNavigate?: () => void;
  onEdit?: () => void;
  offboardingData?: OffboardAsset | OffboardAsset[];
  onDispose: () => void;
  onRefreshStore: () => void;
  isDeviceRefreshEquipment?: boolean;
  isDeviceRefresh?: boolean;
  firstActionableItemId?: string | null;
}

const AllEquipmentsTableActions: React.FC<AllEquipmentsTableActionsProps> =
  memo((props) => {
    const {
      item,
      onTransferEquipment,
      onStoreEquipment,
      onEdit,
      viewHref,
      onBeforeViewNavigate,
      offboardingData,
      onDispose,
      onRefreshStore,
      isDeviceRefreshEquipment,
      isDeviceRefresh,
      firstActionableItemId,
    } = props;

    const pathname = usePathname();
    const { view, isPending } = useViewNavigation();
    const assetDetail = useEntitlementOn("asset_detail");
    const deviceRefreshSelection = useAppSelector(
      (state) => state.persistedReducers.equipEmployee?.selectedEquipment,
    ) as IAssetRefreshList | IAssetRefreshList[] | undefined;
    const showViewAndEditActions = pathname === routes.All_Equipments;

    const offboardingList = Array.isArray(offboardingData)
      ? offboardingData
      : offboardingData
        ? [offboardingData]
        : [];

    const refreshList = Array.isArray(deviceRefreshSelection)
      ? deviceRefreshSelection
      : deviceRefreshSelection
        ? [deviceRefreshSelection]
        : [];

    const matchedEquipment =
      isDeviceRefreshEquipment && isDeviceRefresh
        ? refreshList.find((data) => data.id === item.id)
        : offboardingList.find((data) => data.id === item.id);
    const matchedActionType =
      matchedEquipment?.actionType as DeviceRefreshActionType;

    const equipmentStatus = normalizeEquipmentStatusKey(item.status);

    const hasAnyAction =
      (!isDeviceRefreshEquipment &&
        !isDeviceRefresh &&
        (showViewAndEditActions ||
          isBulkActionEligible(item.status, "transfer") ||
          isBulkActionEligible(item.status, "store"))) ||
      (isDeviceRefreshEquipment &&
        isDeviceRefresh &&
        (isBulkActionEligible(item.status, "dispose") ||
          isBulkActionEligible(item.status, "store")));

    const isFirstActionable = hasAnyAction && item.id === firstActionableItemId;

    const handleViewEquipment = () => {
      if (!viewHref || !assetDetail.ready) return;
      onBeforeViewNavigate?.();
      view(equipmentViewHref(viewHref, assetDetail.on));
    };

    const menuTrigger = (
      <>
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
      </>
    );

    const isViewOnly =
      equipmentStatus === "under_repair" || equipmentStatus === "faulty";

    if (isViewOnly) {
      return (
        <CustomTooltip
          autoShowOnce={false}
          content={
            <span className="text-white text-xs">
              Only viewing is allowed while equipment is {equipmentStatus}.
            </span>
          }
        >
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">{menuTrigger}</div>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col gap-y-3 text-sm">
              <ActionItem
                label="View equipment"
                Icon={ScanEye}
                onClick={handleViewEquipment}
              />
            </PopoverContent>
          </Popover>
        </CustomTooltip>
      );
    }

    return (
      <CustomTooltip
        autoShowOnce={isFirstActionable}
        content={
          <span className="text-white text-xs">
            Perform actions on equipment here
          </span>
        }
      >
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">{menuTrigger}</div>
          </PopoverTrigger>
          <PopoverContent className="flex w-auto flex-col gap-y-3 text-sm">
            <EquipmentTableActionMenuItems
              item={item}
              matchedActionType={matchedActionType}
              showViewAndEditActions={showViewAndEditActions}
              onView={handleViewEquipment}
              onEdit={onEdit}
              onTransfer={onTransferEquipment}
              onStore={onStoreEquipment}
              onDispose={onDispose}
              onRefreshStore={onRefreshStore}
              isDeviceRefreshEquipment={isDeviceRefreshEquipment}
              isDeviceRefresh={isDeviceRefresh}
            />
          </PopoverContent>
        </Popover>
      </CustomTooltip>
    );
  });

export default AllEquipmentsTableActions;
