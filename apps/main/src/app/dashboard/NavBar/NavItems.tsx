import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type { NavItem, NavSubItem } from "./NavItems.data";
import { isChildActive } from "./NavItems.data";
import { useDashboardNavItems } from "./useDashboardNavItems";

export type { NavItem, NavSubItem };

const NavItems = () => {
  const pathname = usePathname();
  const navItems = useDashboardNavItems();

  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          {navItems.map((item) => (
            <NavigationMenuItem
              key={item.id}
              className={cn(item.removeNav && "hidden")}
            >
              {item.children?.length ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "gap-1 text-white px-3 py-2 hover:bg-gray-700 bg-gray-950 data-[state=open]:bg-gray-700",
                        item.isActive && "bg-gray-700",
                      )}
                    >
                      {item.name}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={8}
                    className="z-[103] min-w-[220px] rounded-lg border-gray-800 bg-gray-950 p-1.5 text-white shadow-xl"
                  >
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.id} asChild>
                        <Link
                          href={child.link}
                          className={cn(
                            "flex w-full rounded-md px-3 py-2 text-sm font-medium text-gray-300 outline-none transition hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white",
                            isChildActive(pathname, child) &&
                              "bg-gray-800 text-white",
                          )}
                        >
                          {child.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-white px-3 py-2 hover:bg-gray-700 bg-gray-950",
                    item.isActive && "bg-gray-700",
                  )}
                >
                  <Link href={item.link}>{item.name}</Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavItems;
