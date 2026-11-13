"use client";

import { useState } from "react";
import { ChevronDown } from "@untitledui/icons";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Tabs } from "@/components/application/tabs/tabs";
import { Button } from "@/components/base/buttons/button";
import PageState from "@/components/PageState";
import { cx } from "@/utils/cx";
import {
  ACTION_META,
  availableActions,
  mergeDeviceActions,
} from "../data/deviceActions";
import { useStorageEquipmentDetail } from "../hooks/useStorageEquipmentDetail";
import type { RequestKind, StoredDevice } from "../types/storage";
import { DeviceAvatar } from "./DeviceAvatar";
import { DrawerDetailsTab } from "./DrawerDetailsTab";
import { DrawerTrackingTab } from "./DrawerTrackingTab";
import { StatusBadge } from "./StorageBadges";
import { DeviceCheckSection } from "./deviceCheck/DeviceCheckSection";

interface Props {
  device: StoredDevice | null;
  isOpen: boolean;
  onClose: () => void;
  onAction: (kind: RequestKind, device: StoredDevice) => void;
}

const TABS = [
  { id: "tracking", label: "Tracking" },
  { id: "details", label: "Details" },
  { id: "check", label: "Device check" },
];

export function DeviceDetailDrawer({
  device,
  isOpen,
  onClose,
  onAction,
}: Props) {
  const [tab, setTab] = useState("tracking");
  const [actionsOpen, setActionsOpen] = useState(false);
  const { detail, isLoading, isError } = useStorageEquipmentDetail(
    device?.id,
    isOpen,
  );

  if (!device) return null;

  const viewDevice = mergeDeviceActions(device, detail?.device);
  const actions = availableActions(viewDevice);
  const act = (kind: RequestKind) => {
    onAction(kind, viewDevice);
    setActionsOpen(false);
  };

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setActionsOpen(false);
        }
      }}
      isDismissable
    >
      <SlideoutMenu.Header
        onClose={onClose}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <div className="flex items-start gap-4">
          <DeviceAvatar
            image={viewDevice.image}
            assetType={viewDevice.assetType}
            name={viewDevice.deviceName}
            size="lg"
          />
          <div className="flex flex-1 flex-col gap-1.5 pr-8">
            <h2 className="text-lg font-semibold text-primary">
              {viewDevice.deviceName}
            </h2>
            <p className="text-sm text-tertiary">{viewDevice.serialNumber}</p>
            <div className="pt-1">
              <StatusBadge
                status={viewDevice.status}
                label={viewDevice.storageStatusLabel}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Tabs selectedKey={tab} onSelectionChange={(k) => setTab(String(k))}>
            <Tabs.List type="button-border" items={TABS} fullWidth>
              {(item) => <Tabs.Item id={item.id}>{item.label}</Tabs.Item>}
            </Tabs.List>
          </Tabs>
        </div>
      </SlideoutMenu.Header>

      <SlideoutMenu.Content>
        <PageState
          isLoading={isLoading}
          isError={isError}
          errorMessage="Unable to load device details."
        >
          {detail && (
            <>
              {tab === "tracking" && <DrawerTrackingTab detail={detail} />}
              {tab === "details" && <DrawerDetailsTab detail={detail} />}
              {tab === "check" && (
                <DeviceCheckSection
                  device={viewDevice}
                  deviceCheck={detail.deviceCheck}
                />
              )}
            </>
          )}
        </PageState>
      </SlideoutMenu.Content>

      {actions.length > 0 && (
        <SlideoutMenu.Footer>
          <div className="flex flex-col">
            <div
              className={cx(
                "grid transition-[grid-template-rows] duration-200 ease-out",
                actionsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div
                className={cx(
                  "overflow-hidden transition-opacity duration-200",
                  actionsOpen ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="flex flex-col gap-2 pb-2">
                  {actions.map((kind) => (
                    <Button
                      key={kind}
                      size="md"
                      color={ACTION_META[kind].color}
                      className="w-full"
                      onClick={() => act(kind)}
                      data-testid="devicedetaildrawer-button"
                    >
                      {ACTION_META[kind].label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <Button
              size="md"
              color="secondary"
              aria-expanded={actionsOpen}
              iconTrailing={ChevronDown}
              onClick={() => setActionsOpen((o) => !o)}
              className={cx(
                "w-full [&_[data-icon=trailing]]:transition-transform [&_[data-icon=trailing]]:duration-200",
                actionsOpen && "[&_[data-icon=trailing]]:rotate-180",
              )}
              data-testid="devicedetaildrawer-button-2"
            >
              {actionsOpen ? "Hide actions" : "Actions"}
            </Button>
          </div>
        </SlideoutMenu.Footer>
      )}
    </SlideoutMenu>
  );
}
