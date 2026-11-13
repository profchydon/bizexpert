"use client";

import { Archive, ChevronDown, Copy, Edit2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Kit } from "../types";

interface Props {
  kit: Kit;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchiveToggle: () => void;
}

const KitDetailActions = ({
  kit,
  onEdit,
  onDuplicate,
  onArchiveToggle,
}: Props) => {
  const ArchiveIcon = kit.is_archived ? RotateCcw : Archive;
  const archiveLabel = kit.is_archived ? "Unarchive" : "Archive";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          data-testid="kitdetailactions-button"
        >
          Actions <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={onEdit}>
          <Edit2 className="mr-2 size-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy className="mr-2 size-4" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onArchiveToggle}>
          <ArchiveIcon className="mr-2 size-4" />
          {archiveLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KitDetailActions;
