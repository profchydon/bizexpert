"use client";

import {
  Archive,
  Copy,
  Edit2,
  Eye,
  MoreVertical,
  RotateCcw,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useListDetailHref } from "@/hooks/tableListLocation";
import routes from "@/routes";
import type { Kit, KitListItem } from "../types";
import { useViewNavigation } from "@/hooks/useViewNavigation";
import { cn } from "@/lib/utils";

interface Props {
  kit: Kit | KitListItem;
  onEdit: (kit: Kit | KitListItem) => void;
  onArchive: (kit: Kit | KitListItem) => void;
  onDuplicate: (kit: Kit | KitListItem) => void;
}

const KitActionsMenu = ({ kit, onEdit, onArchive, onDuplicate }: Props) => {
  const { view, isPending } = useViewNavigation();
  const viewHref = useListDetailHref(routes.KIT_DETAIL(kit.id));
  const ArchiveIcon = kit.is_archived ? RotateCcw : Archive;
  const archiveLabel = kit.is_archived ? "Unarchive" : "Archive";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <button
            type="button"
            aria-label={`${kit.name ?? "Kit"} actions`}
            disabled={isPending}
            className="rounded-md p-1 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 disabled:opacity-60"
          >
            <MoreVertical className="size-5" />
          </button>
          {isPending ? (
            <span
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center",
                "rounded-md bg-primary/80",
              )}
            >
              <Loader2 className="size-4 animate-spin text-fg-quaternary" />
            </span>
          ) : null}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => view(viewHref)}>
          <Eye className="mr-2 size-4" /> View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(kit)}>
          <Edit2 className="mr-2 size-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDuplicate(kit)}>
          <Copy className="mr-2 size-4" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onArchive(kit)}>
          <ArchiveIcon className="mr-2 size-4" />
          {archiveLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KitActionsMenu;
