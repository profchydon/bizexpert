"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ServerOfficeArea } from "@/types/offices";
import {
  officeAreaActionButtonClass,
  officeAreaDeleteButtonClass,
} from "./officeAreasCardClasses";

interface Props {
  area: ServerOfficeArea;
  canManage: boolean;
  isRemoving: boolean;
  onRename: () => void;
  onRemove: () => void;
}

export function OfficeAreaRow({
  area,
  canManage,
  isRemoving,
  onRename,
  onRemove,
}: Props) {
  const assetCount = area.asset_count ?? 0;

  return (
    <li className="flex items-center justify-between gap-3 px-5 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">
          {area.name}
        </p>
        <p className="text-xs text-gray-500">
          {assetCount} asset{assetCount === 1 ? "" : "s"}
        </p>
      </div>
      {canManage && (
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={officeAreaActionButtonClass}
            onClick={onRename}
            aria-label={`Rename ${area.name}`}
            data-testid="officearearow-button"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={officeAreaDeleteButtonClass}
            onClick={onRemove}
            isLoading={isRemoving}
            aria-label={`Remove ${area.name}`}
            data-testid="officearearow-button-2"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      )}
    </li>
  );
}
