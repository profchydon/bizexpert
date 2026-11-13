"use client";

import {
  ClipboardCheck,
  Download01,
  PackagePlus,
  Send01,
  Trash02,
} from "@untitledui/icons";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { orderTypeLabel } from "../data/storageMeta";
import type { OrderKind, StorageOrder } from "../types/storage";
import { OrderTypeBadge, RequestStatusBadge } from "./StorageBadges";
import { StorageOrderDetailBody } from "./StorageOrderDetailBody";

interface Props {
  order: StorageOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const KIND_ICON: Record<OrderKind, typeof Send01> = {
  intake: Download01,
  open_fleet_import: PackagePlus,
  deployment: Send01,
  device_check: ClipboardCheck,
  disposal: Trash02,
};

export function StorageOrderDetailSlideout({ order, isOpen, onClose }: Props) {
  if (!order) return null;
  const Icon = KIND_ICON[order.kind];

  return (
    <SlideoutMenu
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
    >
      <SlideoutMenu.Header
        onClose={onClose}
        className="pb-5 shadow-[inset_0px_-1px_0px_0px] shadow-border-secondary"
      >
        <div className="flex items-start gap-4">
          <FeaturedIcon icon={Icon} size="lg" color="brand" theme="modern" />
          <div className="flex flex-1 flex-col gap-1.5 pr-8">
            <h2 className="text-lg font-semibold text-primary">
              {order.flowLabel ?? orderTypeLabel(order.kind, order.entrySource)}{" "}
              · {order.orderNumber ?? order.id}
            </h2>
            <p className="text-sm text-tertiary">{order.deviceName}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <OrderTypeBadge
                kind={order.kind}
                entrySource={order.entrySource}
                flowLabel={order.flowLabel}
              />
              <RequestStatusBadge
                status={order.status}
                label={order.statusLabel}
              />
            </div>
          </div>
        </div>
      </SlideoutMenu.Header>
      <SlideoutMenu.Content className="gap-5">
        <StorageOrderDetailBody order={order} />
      </SlideoutMenu.Content>
    </SlideoutMenu>
  );
}
