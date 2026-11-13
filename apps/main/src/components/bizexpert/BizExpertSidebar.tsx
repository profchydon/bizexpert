"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { bizexpertNavIcon } from "@/app/dashboard/NavBar/bizexpertNavIcons";
import { bizexpertNavItems } from "@/app/dashboard/NavBar/bizexpertNavItems";
import { NavBrand } from "@/app/dashboard/NavBar/NavBrand";
import { BizExpertNavAccount } from "./BizExpertNavAccount";
import { BizExpertSidebarGroup } from "./BizExpertSidebarGroup";
import {
  bizExpertSidebarAsideClass,
  bizExpertSidebarBackdropClass,
  bizExpertSidebarCloseClass,
  bizExpertSidebarClosedClass,
  bizExpertSidebarFooterClass,
  bizExpertSidebarHeaderClass,
  bizExpertSidebarLinkActiveClass,
  bizExpertSidebarLinkClass,
  bizExpertSidebarNavClass,
} from "./bizExpertSidebarClasses";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function BizExpertSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const items = bizexpertNavItems(pathname);

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className={bizExpertSidebarBackdropClass}
          onClick={onClose}
        />
      ) : null}
      <aside
        aria-label="Dashboard"
        className={cn(
          bizExpertSidebarAsideClass,
          open ? "max-lg:translate-x-0" : bizExpertSidebarClosedClass,
        )}
      >
        <div className={bizExpertSidebarHeaderClass}>
          <NavBrand isEmployeeNav={false} />
          <button
            type="button"
            aria-label="Close menu"
            className={bizExpertSidebarCloseClass}
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className={bizExpertSidebarNavClass}>
          {items.map((item) => {
            if (item.children?.length) {
              return (
                <BizExpertSidebarGroup
                  key={item.id}
                  item={item}
                  onClose={onClose}
                />
              );
            }
            const Icon = bizexpertNavIcon(item.id);
            return (
              <Link
                key={item.id}
                href={item.link}
                onClick={onClose}
                aria-current={item.isActive ? "page" : undefined}
                className={cn(
                  bizExpertSidebarLinkClass,
                  item.isActive && bizExpertSidebarLinkActiveClass,
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className={bizExpertSidebarFooterClass}>
          <BizExpertNavAccount />
        </div>
      </aside>
    </>
  );
}
