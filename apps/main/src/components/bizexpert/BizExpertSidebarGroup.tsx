"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { bizexpertNavIcon } from "@/app/dashboard/NavBar/bizexpertNavIcons";
import {
  isChildActive,
  type NavItem,
} from "@/app/dashboard/NavBar/NavItems.data";
import {
  bizExpertSidebarChildClass,
  bizExpertSidebarGroupClass,
  bizExpertSidebarLinkActiveClass,
  bizExpertSidebarLinkClass,
} from "./bizExpertSidebarClasses";

type Props = {
  item: NavItem;
  onClose: () => void;
};

export function BizExpertSidebarGroup({ item, onClose }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(item.isActive);
  const Icon = bizexpertNavIcon(item.id);

  useEffect(() => {
    if (item.isActive) setOpen(true);
  }, [item.isActive]);

  return (
    <div className={bizExpertSidebarGroupClass}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(bizExpertSidebarLinkClass, "w-full")}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">{item.name}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open
        ? item.children?.map((child) => {
            const ChildIcon = bizexpertNavIcon(child.id);
            const active = isChildActive(pathname, child);
            return (
              <Link
                key={child.id}
                href={child.link}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  bizExpertSidebarChildClass,
                  active && bizExpertSidebarLinkActiveClass,
                )}
              >
                <ChildIcon className="h-4 w-4 shrink-0" />
                {child.name}
              </Link>
            );
          })
        : null}
    </div>
  );
}
