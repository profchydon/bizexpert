"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiDotsHorizontal } from "react-icons/hi";
import { copy, edit, folder, share, settings } from "@/assets/icons";
import Image from "next/image";
import { useViewNavigation } from "@/hooks/useViewNavigation";

const CatalogActions: React.FC<{
  viewHref: string;
  onEdit: () => void;
  onConfigure: () => void;
  onDuplicate: () => void;
  onShare: () => void;
}> = ({ viewHref, onEdit, onConfigure, onDuplicate, onShare }) => {
  const { view, isPending } = useViewNavigation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          isLoading={isPending}
          data-testid="catalogactions-button"
        >
          <HiDotsHorizontal className="text-gray-500 text-xl" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[200px] text-sm flex flex-col gap-y-2 font-medium text-gray-700"
      >
        <DropdownMenuItem
          className="flex flex-row items-center gap-x-2 cursor-pointer"
          onClick={() => view(viewHref)}
        >
          <Image src={folder} alt="folder" />
          View catalog
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex flex-row items-center gap-x-2 cursor-pointer"
          onClick={onEdit}
        >
          <Image src={edit} alt="edit" />
          Edit catalog
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex flex-row items-center gap-x-2 cursor-pointer"
          onClick={onDuplicate}
        >
          <Image src={copy} alt="copy" />
          Duplicate catalog
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex flex-row items-center gap-x-2 cursor-pointer"
          onClick={onConfigure}
        >
          <Image src={settings} alt="settings" />
          Configure catalog
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex flex-row items-center gap-x-2 cursor-pointer"
          onClick={onShare}
        >
          <Image src={share} alt="share" />
          Share catalog
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CatalogActions;
