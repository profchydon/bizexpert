"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "./NavItems.data";
import { navBarActionButtonClass } from "./navBarActionButtonClass";

interface NavBarMobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  onClose: () => void;
}

export function NavBarMobileMenu({
  isOpen,
  navItems,
  onClose,
}: Readonly<NavBarMobileMenuProps>) {
  const pathname = usePathname();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute left-0 top-full z-[103] flex w-full flex-col items-stretch gap-4 border-t border-white/10 bg-gray-900 p-4 sm:p-6 lg:hidden">
      <div className="flex justify-end">
        <button
          type="button"
          aria-label="Close menu"
          className={navBarActionButtonClass}
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {navItems
        .filter((item) => !item.removeNav)
        .map((item) =>
          item.children?.length ? (
            <div key={item.id} className="flex flex-col items-stretch gap-2">
              <span
                className={cn(
                  "rounded-md px-3 py-2 text-center font-medium text-white",
                  item.isActive ? "bg-gray-700" : "bg-gray-900",
                )}
              >
                {item.name}
              </span>
              <div className="flex flex-col items-stretch gap-1 pl-3">
                {item.children.map((child) => {
                  const childActive =
                    pathname === child.link ||
                    pathname.startsWith(`${child.link}/`);

                  return (
                    <Link href={child.link} key={child.id} onClick={onClose}>
                      <span
                        className={cn(
                          "block rounded-md px-3 py-2 text-center text-sm text-white",
                          childActive
                            ? "bg-gray-700"
                            : "bg-gray-900 hover:bg-gray-700",
                        )}
                      >
                        {child.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <Link href={item.link} key={item.id} onClick={onClose}>
              <span
                className={cn(
                  "block rounded-md px-3 py-2 text-center text-white hover:bg-gray-700",
                  item.isActive
                    ? "bg-gray-700"
                    : "bg-gray-900 hover:bg-gray-600",
                )}
              >
                {item.name}
              </span>
            </Link>
          ),
        )}
    </div>
  );
}
