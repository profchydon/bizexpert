"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useListDetailHref } from "@/hooks/tableListLocation";
import routes from "@/routes";
import type { Kit, KitListItem } from "../types";
import { formatItemsCount, formatKitDate } from "../utils";
import FulfillmentBadge from "./FulfillmentBadge";
import KitActionsMenu from "./KitActionsMenu";
import KitItemImages from "./KitItemImages";
import KitPill from "./KitPill";
import KitStatusBadge from "./KitStatusBadge";

interface Props {
  kit: Kit | KitListItem;
  onEdit: (kit: Kit | KitListItem) => void;
  onArchive: (kit: Kit | KitListItem) => void;
  onDuplicate: (kit: Kit | KitListItem) => void;
}

const KitCard = ({ kit, onEdit, onArchive, onDuplicate }: Props) => {
  const href = useListDetailHref(routes.KIT_DETAIL(kit.id));

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-[0_1px_2px_rgba(10,13,18,0.05)] transition duration-100 hover:shadow-sm",
        kit.status === "archived" && "opacity-60",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <KitPill>{formatItemsCount(kit.items_count)}</KitPill>
          <FulfillmentBadge mode={kit.fulfillment_mode} />
          <KitStatusBadge status={kit.status} />
        </div>
        <KitActionsMenu
          kit={kit}
          onEdit={onEdit}
          onArchive={onArchive}
          onDuplicate={onDuplicate}
        />
      </div>

      <KitItemImages items={kit.items_summary} limit={4} />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="truncate text-sm font-semibold text-gray-900">
          {kit.name ?? "Untitled kit"}
        </h3>
        {"description" in kit && kit.description && (
          <p className="line-clamp-2 text-sm text-gray-600">
            {kit.description}
          </p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="text-xs text-gray-500">
          Updated {formatKitDate(kit.updated_at)}
        </span>
        <Button
          asChild
          size="sm"
          className="h-9 gap-1 rounded-lg px-4 text-sm"
          data-testid="kitcard-button"
        >
          <Link href={href}>
            View <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
};

export default KitCard;
