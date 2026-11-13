"use client";

import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBizExpertAuth } from "@/store/bizexpert/auth-context";
import routes from "@/routes";
import { bizExpertAccountTriggerClass } from "./bizExpertSidebarClasses";

export function BizExpertNavAccount() {
  const { user, logout } = useBizExpertAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={bizExpertAccountTriggerClass}
          aria-label="Account menu"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-sm font-semibold text-white">
            {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
          </span>
          <span className="min-w-0 truncate text-sm font-medium text-white">
            {user?.name ?? "Account"}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="z-[103] min-w-[200px] border-gray-800 bg-gray-950 text-white"
      >
        <div className="px-3 py-2 text-xs text-gray-400">{user?.email}</div>
        <DropdownMenuItem asChild>
          <Link
            href={routes.SETTINGS}
            className="flex items-center gap-2 text-gray-200"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 text-gray-200 focus:bg-gray-800"
          onSelect={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
